# Node koa2 + vue 实现文件分片上传
> 大文件上传会消耗大量的时间，而且中途有可能上传失败。这时我们需要前端和后端配合来解决这个问题。

## 解决思路
1. 服务端实现一个上传接口，一个合并接口
1. 前端实现文件分片，减少每次请求消耗的时间，如果某次请求失败可以单独上传，而不是从头开始
2. 所有分片上传完，通知服务端合并文件分片
3. 控制并发的请求数量，避免浏览器内存溢出（附带比较没有控制并发的情况）
4. 当因为网络或者其他原因导致某次的请求失败，我们重新发送请求

## 技术栈
前端：
1. vue (MVVM 框架)
2. axios （接口请求）

服务端：
1. Node.js
2. koa
3. koa-body（获取文件上传后FormData格式的信息）
4. koa-static（处理静态文件）
5. fs-extra（fs的一个扩展，提供了非常多的便利API，并且继承了fs所有方法和为fs方法添加了promise的支持。）
6. path

## 前端实现分片
> 在JavaScript中，FIle对象是' Blob '对象的子类，该对象包含一个重要的方法slice，通过该方法我们可以这样分割二进制文件

### 简单版
>上传完成一个分片再继续下一个，全部上传完成，调用merge通知服务端合并
```js
// template
        <input id="fileInput" type="file" name="file" multiple="multiple" />
        <button @click="sliceUpload(0)">递归上传</button>
        <div>
            start:{{ time.start }}--end:{{ time.end }}
            耗时：{{ time.end-time.start }}
        </div>
```
```js
import axios from 'axios';
export default {
    name: 'DemoUpload',
    data() {
        return {
            time: {
                start: 0,
                end: 0
            }
        };
    },
    methods: {
        merge(name){
            axios.post('http://localhost:9000/api/v1/upload/merge', {name}).then(res => {
                console.log(res);
            });
        },
        sliceUpload(index) {
            index === 0 && (this.time.start = Date.now());
            const file = document.getElementById('fileInput').files[0];

            if (!file) return;
            // 文件分片

            let chunkSize = 1024 * 500; // 50KB 50KB Section size
            // [ 文件名, 文件后缀 ]
            const [fname, suffix] = file.name.split('.');
            // 获取当前片的起始字节
            const start = index * chunkSize;
            if (start > file.size) {// 当超出文件大小，停止递归上传
                this.merge(file.name);
                this.time.end = Date.now();
                return;
            }
            const blob = file.slice(start, start + chunkSize);
            // 为每片进行命名
            const blobName = `${fname}.${index}.${suffix}`;
            const blobFile = new File([blob], blobName);

            const formData = new FormData();
            formData.append('file', blobFile);
            axios.post('http://localhost:9000/api/v1/upload/slice', formData).then(res => {
                console.log(res);
                // 递归分片上传
                this.sliceUpload(++index);
            });
        }
    }
};
```
### 控制并发版
1. 实现并发池
2. 上传分片塞进并发池里
3. 超出最大并发数限制 使用await Promise.race 来等待其中一个完成再继续
4. 收集失败的，等上传完成一遍后统一再次重试上传失败的集合
5. 全部上传完成，调用merge通知服务端合并
```js
// template
        <input id="fileInput1" type="file" name="file" multiple="multiple" />
        <button @click="sliceUpload1(0)">并发上传</button>
        <div>
            start:{{ time.start1 }}--end:{{ time.end1 }}
            耗时：{{ time.end1-time.start1 }}
        </div>
```
```js
import axios from 'axios';
export default {
    name: 'DemoUpload',
    data() {
        return {
            time: {
                start: 0,
                start1: 0,
                end: 0,
                end1: 0
            }
        };
    },
    methods: {
        merge(name){
            axios.post('http://localhost:9000/api/v1/upload/merge', {name}).then(res => {
                console.log(res);
            });
        },
        sliceUpload1() {
            this.time.start1 = Date.now();
            const file = document.getElementById('fileInput1').files[0];
            if (!file) return;
            // [ 文件名, 文件后缀 ]
            const [fname, suffix] = file.name.split('.');
            // 文件分片
            let size = 1024 * 1024; // 分片大小设置
            let fileChunks = [];
            let index = 0;        // 分片序号
            for (let cur = 0; cur < file.size; cur += size) {
                fileChunks.push({
                    hash: index++,
                    blob: file.slice(cur, cur + size)
                });
            }
            const that = this;
            const uploadFileChunks = async function (list){
                if (list.length === 0){
                    // 所有分片上传完成，通知如无
                    that.merge(file.name);
                    that.time.end1 = Date.now();
                    return;
                }
                let pool = [];       // 并发池
                let max = 3;         // 最大并发数
                let finish = 0;      // 完成数量
                let failList = [];   // 失败列表
                for (let i = 0;i < list.length;i++){
                    let item = list[i];
                    const blobName = `${fname}.${item.hash}.${suffix}`;
                    const blobFile = new File([item.blob], blobName);
                    let formData = new FormData();
                    formData.append('file', blobFile);
                    let task = axios.post('http://localhost:9000/api/v1/upload/slice', formData).then(res => {
                        // console.log('🚀 > task > res', i, '>>', res);
                    });
                    task.then(data=>{
                        // 从并发池中移除已经完成的请求
                        let index = pool.findIndex(t=> t === task);
                        pool.splice(index);
                    }).catch(()=>{
                        failList.push(item);
                    }).finally(()=>{
                        finish++;
                        // 如果有失败的重新上传
                        if (finish === list.length){
                            uploadFileChunks(failList);
                        }
                    });
                    pool.push(task);
                    if (pool.length === max){
                        // Promise.race 赛跑，哪个结果获得的快，就返回那个结果，不管结果本身是成功状态还是失败状态。
                        await Promise.race(pool);
                    }
                }
            };
            uploadFileChunks(fileChunks);
        }
    }
};
```

### 服务端实现
```js
//app.js
const Koa = require('koa');
const InitManager = require('./core/init');
const cors = require('@koa/cors');
const {koaBody} = require('koa-body');
const static = require('koa-static');

require('module-alias/register');

const catchError = require('./middlewares/exception');

const app = new Koa();
// 处理静态资源
app.use(static(__dirname + '/public', {
    // 默认为true  访问的文件为index.html  可以修改为别的文件名或者false
    index: false,
    // 是否同意传输隐藏文件
    hidden: false,
    // 如果为true，则在返回next()之后进行服务，从而允许后续中间件先进行响应
    defer: true
}));

app.use(cors());
app.use(catchError);
// koa-body 中间插件 文件提交及form-data
app.use(koaBody({
    formLimit: '1mb',
    multipart: true,
    formidable: {
        maxFileSize: 200 * 1024 * 1024,
        keepExtensions: true
    }
}));


InitManager.initCore(app);

app.listen(9000, () => {
    console.log('Koa is listening in http://localhost:9000');
});

module.exports = app;

```
```js
// nodejs-koa-blog/app/api/v1/sliceupload.js
const path = require('path');
const fse = require('fs-extra');
const {Resolve} = require('@lib/helper');
const res = new Resolve();

const Router = require('koa-router');

const router = new Router({
    prefix: '/api/v1'
});
const UPLOAD_DIR = path.resolve(__dirname + '../../../../public');


router.post('/upload/slice',  async ctx => {
    try {
        // koa-body 在处理完 file 后会绑定在 ctx.request.files
        const file = ctx.request.files.file;
        // [ name, index, ext ] - 分割文件名
        const fileNameArr = file.originalFilename.split('.');
        // 存放切片的目录
        const chunkDir = `${UPLOAD_DIR}/${fileNameArr[0]}`;
        if (!fse.existsSync(chunkDir)) {
            // 创建大文件的临时目录
            await fse.mkdirs(chunkDir);
        }
        // 原文件名.index - 每个分片的具体地址和名字
        const dPath = path.join(chunkDir, fileNameArr[1]);

        // 将分片文件从 temp 中移动到本次上传大文件的临时目录
        await fse.move(file.filepath, dPath, {overwrite: true});
        const data = '文件上传成功';
        ctx.response.status = 200;
        ctx.body = res.json(data);
    } catch (error) {
        ctx.body = res.fail(error);
    }
});

// 合并文件
router.post('/upload/merge', async ctx => {
    try {
        const {name} = ctx.request.body;
        const fname = name.split('.')[0];
        const chunkDir = path.join(UPLOAD_DIR, fname);
        const chunks = await fse.readdir(chunkDir);

        chunks.sort((a, b) => a - b).map(chunkPath => {
            // 合并文件
            fse.appendFileSync(
                path.join(UPLOAD_DIR, name),
                fse.readFileSync(`${chunkDir}/${chunkPath}`)
            );
        });
        // 删除临时文件夹
        fse.removeSync(chunkDir);
        // 返回文件地址
        const data = {
            url: `http://localhost:9000/${name}`
        };
        ctx.response.status = 200;
        ctx.body = res.json(data);
    } catch (error) {
        ctx.body = res.fail(error);
    }
});

module.exports = router;

```