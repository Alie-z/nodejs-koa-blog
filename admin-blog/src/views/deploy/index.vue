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
            v-for="(activity, index) in timelineData[card]"
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
            timelineData: {}
        };
    },
    mounted() {
        if(!this.isSocket){
          // 连接socket服务
          this.$socket.connect();
          // 触发server端的start事件
          this.$socket.emit('start', this.uid);
        }
    },
    beforeDestroy() {
      this.isSocket= false;
      this.$socket.disconnect(); 
    },
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
      },
      demo(data) {
        console.log('🚀 > demo > data', data)
        this.setSocketData('demo',data);
      },
      admin(data) {
        this.setSocketData('admin',data);
      },
      servers(data) {
        console.log('🚀 > servers > data', data)
        this.setSocketData('servers',data);
      },
      frontend(data) {
        this.setSocketData('frontend',data);
      },
      install(data) {
        this.setSocketData('install',data);
      },
    },
    methods: {
        setSocketData(key,data) {
          console.log('🚀 > setSocketData > key', key);
          const keyData = this.timelineData[key];
          const msg = [...(keyData || []),...[{
                content: data,
                timestamp: new Date().toLocaleString()
              }]]
          this.$set(this.timelineData, key, msg);
          console.log('🚀 > setSocketData > this.timelineData', this.timelineData)
        },
        async start(){
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
   width: 500px;
   margin: 20px;
}
</style>
