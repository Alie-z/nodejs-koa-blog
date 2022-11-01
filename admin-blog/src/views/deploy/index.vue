<template>
  <div class="category">
        <div class="search">
          <el-form
            ref="deployForm"
            :model="deployForm"
            inline
          >
            <el-form-item label="选择要部署的服务：" prop="status">
              <el-select
                v-model="deployForm.deploy"
                placeholder="请选择状态"
                clearable
              >
                <el-option v-for="opt in deployOpt" :key="opt"  :label="opt" :value="opt" />
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
      <el-card class="box-card" v-for="card,index in Object.keys(timelineData)" :key="index">
        <div slot="header" class="clearfix">
          <span>{{card}}</span>
        </div>
        <el-timeline :reverse="true">
          <el-timeline-item
            v-for="(activity, index) in timelineData[deployForm.deploy]"
            :key="index"
            :timestamp="activity.timestamp">
            {{activity.content}}
          </el-timeline-item>
        </el-timeline>
      </el-card>
    </div>
  </div>
</template>
<script>
import { deploy } from '@/api/deploy'
export default {
  name: 'DeployIndex',
    data() {
        return {
            id:'',
            uid:2,
            isSocket: false,
            msg:[],
            deployOpt:['admin','servers','frontend','install','demo'],
            deployForm: {
              deploy: 'admin'
            },
            timelineData: {
              admin:[{
                content: '活动按期开始',
                timestamp: '2018-04-15'
              }, {
                content: '通过审核',
                timestamp: '2018-04-13'
              }, {
                content: '创建成功',
                timestamp: '2018-04-11'
              }]
            }
        };
    },
    mounted() {},
    sockets: {
      connect() {
        this.id = this.$socket.id;
        console.log('connect---监听socket连接状态', this.id);
      },
      disconnect(reason) {
        console.log('disconnect--socket断开服务的原因：',reason);
      },
      message(data) { //监听message事件，方法是后台定义和提供的
        console.log('message 接收到服务端传回的参数：',data );
        this.msg = [...this.msg,data];
        console.log('🚀 > message > this.msg', this.msg);
      }
    },
    methods: {
        // 执行socket服务
        start(){
          if(!this.isSocket){
          // 连接socket服务
          this.$socket.connect();
          // 触发server端的start事件
          this.$socket.emit('start', this.uid);
          }
          const res = await deploy({ kw: this.deployForm.deploy })
          console.log('🚀 > start > res', res)
        }
    }
}
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
   width: 400px;
   margin: 20px;
}
</style>
