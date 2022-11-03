#从零到一实现自动化部署


上一篇讲到服务器部署Node项目、Vue spa静态项目、ssr项目
- [个人blob地址](http://119.91.139.245:8080/article?id=1)
- [csdn地址](https://blog.csdn.net/zm06201118/article/details/127576999)

然而每次都要去手动部署，不仅麻烦，对Nginx，Linux不熟悉的也不友好，目前的常见的自动化部署有`jenkins`、`docker`等，但是有一定的学习成本，本文通过Node+vue的实现一键自动化部署。

## 技术栈
前端：
1. vue (MVVM 框架)
2. element-ui (ui框架)
3. axios （接口请求）
4. socket.io-client （创建 io 实例）
5. vue-socket.io ($socket挂载到vue实例)

服务端：
1. Node.js
2. koa
3. socket.io
4. log4js
5. pm2

## 实现思路
> 前端选择要部署的项目点击部署按钮，调用node提供的部署接口，node拿到参数执行部署脚本，并将部署 log 通过websocket返回给前端

流程图如下
![image1.png](https://bce.bdstatic.com/doc/bd-idg-clw-xiaoduzhushou/Paper/image1_625e427.png)

## 具体实现

### 服务端
#### 1、开启socket服务
```js
// app.js
// 开启 socket 服务
// socket模块
const {Server} = require('socket.io');
// 为socket新起个端口
const io = new Server(9001, {
    // 是否启用与 Socket.IO v2 客户端的兼容性。
    allowEIO3: true,
    transports: ['websocket', 'polling'],
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});


io.on('connection', socket => {
    console.log('connection socket连接成功');
    app.context.socketIo = socket;
});

```

#### 2. 实现deploy接口
```js
// app/api/v1/deploy.js
const Router = require('koa-router');

const {DeployValidator} = require('@validators/deploy');
const {Deploy} = require('@deploy/index.js');
const {Resolve} = require('@lib/helper');
const res = new Resolve();

const router = new Router({
    prefix: '/api/v1'
});

//
router.post('/deploy', async ctx => {
    // 通过验证器校验参数是否通过
    const v = await new DeployValidator().validate(ctx);

    // 搜索写真
    const [err, data] = await Deploy.runSh({
        kw: v.get('body.kw'),
        socketIo: ctx.socketIo
    });
    console.log('🚀 > data', err, data);

    if (!err) {
        // 返回结果
        ctx.response.status = 200;
        ctx.body = res.json(data);
    } else {
        ctx.body = res.fail(err);
    }
});

module.exports = router;

```
#### 3. 判断部署脚本是否存在
```js
// app/deploy/index.js
const path = require('path');
const fs = require('fs');
const runCmd = require('../lib/runCmd.js');
const logger = require('../lib/logger.js');
class Deploy {
    // 执行部署脚本
    // koa 注意异步 404 的问题
    static runSh(params) {
        const {kw, socketIo} = params;
        let shPath = path.join(__dirname, `../../sh/${kw}.sh`);
        return new Promise(resolve => {
            try {
                fs.access(shPath, fs.constants.F_OK, err => {
                    if (err) {
                        return resolve([`${shPath}该脚本不存在`, null]);
                    } else {
                        runCmd(
                            'sh',
                            [shPath],
                            text => {
                                resolve([null, text]);
                            },
                            socketIo,
                            kw
                        );
                    }
                });
            } catch (e) {
                logger.info(e);
                resolve([e, null]);
            }
        });
    }

}

module.exports = {
    Deploy
};

``` 
#### 4. 执行脚本并输出log
```js
// app/lib/runCmd.js
const logger = require('./logger');

// 使用子进程执行命令
function runCmd(cmd, args, callback, socketIo, kw) {
    const spawn = require('child_process').spawn;
    const child = spawn(cmd, args);
    let resp = '当前执行路径：' + process.cwd() + '\n';
    logger.info(resp);
    socketIo && socketIo.emit(kw || 'message', resp);
    child.stdout.on('data', buffer => {
        callback('开始部署');
        let info = buffer.toString();
        info = `${new Date().toLocaleString()}: ${info}`;
        resp += info;
        logger.info(info);
        socketIo && socketIo.emit(kw || 'message', info);
    // log 较多时，怎么实时将消息通过接口返给前端，只能是 socket
    });
    child.stdout.on('end', () => {
        callback(resp);
    });

    // shell 脚本执行错误信息也返回
    // let errorMsg = "";
    // 错误信息 end、正常信息 end 可能有先后，统一成一个信息
    child.stderr.on('data', buffer => {
        let info = buffer.toString();
        info = `${new Date().toLocaleString()}: ${info}`;
        resp += info;
        logger.info(info);
        socketIo && socketIo.emit(kw || 'message', info);
    });
    child.stderr.on('end', () => {
        callback(resp);
    });
}

module.exports = runCmd;

``` 

```js
// app/lib/logger.js
const log4js = require('log4js');
const logger = log4js.getLogger();
logger.level = 'debug';

module.exports = logger;

``` 
### 客户端（前端）
#### 1、链接socketio

```js
const wsPath =process.env.NODE_ENV === 'production'? 'ws://119.91.139.245:9001': 'ws://localhost:9001';

import SocketIO from 'socket.io-client';

import VueSocketIO from 'vue-socket.io';

const options = {
    autoConnect: false
};
Vue.use(new VueSocketIO({
    // nodejs-koa-blog/admin-blog/src/main.js
    // 调试模式，开启后将在命令台输出蓝色的相关信息
    debug: true,
    connection: SocketIO(wsPath, options)
}));
``` 

#### 2、页面UI + 逻辑
```js
// nodejs-koa-blog/admin-blog/src/views/deploy/index.vue
<template>
    <div class="category">
        <div class="search">
            <el-form
                ref="deployForm"
                :model="deployForm"
                inline>
                <el-form-item label="选择要部署的服务：" prop="status">
                    <el-select
                        v-model="deployForm.deploy"
                        placeholder="请选择状态"
                        clearable>
                        <el-option v-for="opt in deployOpt" :key="opt" :label="opt" :value="opt" />
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" size="medium" @click="start">
                        部署
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="log-content">
            <el-card v-for="card,index in Object.keys(timelineData)" :key="index" class="box-card">
                <template #header>
                    <div class="clearfix">
                        <span>{{ card }}</span>
                    </div>
                </template>
                <el-timeline :reverse="true">
                    <el-timeline-item
                        v-for="activity,idx in timelineData[card]"
                        :key="idx"
                        :timestamp="activity.timestamp">
                        {{ activity.content }}
                    </el-timeline-item>
                </el-timeline>
            </el-card>
        </div>
    </div>
</template>
<script>
import {deploy} from '@/api/deploy';
export default {
    name: 'DeployIndex',
    data() {
        return {
            id: '',
            uid: 2,
            isSocket: false,
            msg: [],
            deployOpt: ['admin', 'servers', 'frontend', 'install', 'demo'],
            deployForm: {
                deploy: 'admin'
            },
            timelineData: {}
        };
    },
    beforeUnmount() {
        this.isSocket = false;
        this.$socket.disconnect();
    },
    mounted() {
        if (!this.isSocket){
            // 连接socket服务
            this.$socket.connect();
            // 触发server端的start事件
            this.$socket.emit('start', this.uid);
        }
    },
    sockets: {
        connect() {
            this.id = this.$socket.id;
            console.log('connect---监听socket连接状态', this.id);
        },
        disconnect(reason) {
            console.log('disconnect--socket断开服务的原因：', reason);
        },
        message(data) {
            // 监听message事件，方法是后台定义和提供的
            console.log('message 接收到服务端传回的参数：', data );
        },
        demo(data) {
            this.setSocketData('demo', data);
        },
        admin(data) {
            this.setSocketData('admin', data);
        },
        servers(data) {
            this.setSocketData('servers', data);
        },
        frontend(data) {
            this.setSocketData('frontend', data);
        },
        install(data) {
            this.setSocketData('install', data);
        }
    },
    methods: {
        setSocketData(key, data) {
            const keyData = this.timelineData[key];
            const msg = [
                ...(keyData || []), ...[
                    {
                        content: data,
                        timestamp: new Date().toLocaleString()
                    }
                ]
            ];
            this.$set(this.timelineData, key, msg);
        },
        async start(){
            const res = await deploy({kw: this.deployForm.deploy});
            console.log('🚀 > start > res', res);
        }
    }
};
</script>

<style scoped lang="scss">
.category {
  box-sizing: border-box;
  margin: 24px;
}
.log-content {
  display: flex;
  flex-wrap: wrap;
}
.box-card {
   width: 500px;
   margin: 20px;
}
</style>
```
```js
//admin-blog/src/api/deploy.js
import request from '@/utils/request';

// 设置部署项目
export function deploy(data) {
    return request({
        url: '/deploy',
        method: 'post',
        data
    });
}

```

## 演示
[查看演示视频](//player.bilibili.com/player.html?bvid=BV1T84y1q7LG&page=1")

---

> 看完记得 [github](https://github.com/Alie-z/nodejs-koa-blog)点个star