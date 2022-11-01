import Vue from 'vue';

import 'normalize.css/normalize.css'; // A modern alternative to CSS resets

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import locale from 'element-ui/lib/locale/lang/en'; // lang i18n

import '@/styles/index.scss'; // global css

import App from './App';
import store from './store';
import router from './router';

import '@/icons'; // icon
import '@/permission'; // permission control

import mavonEditor from 'mavon-editor';
import 'mavon-editor/dist/css/index.css';
// use
Vue.use(mavonEditor);

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
let wsPath = 'ws://localhost:9001';
if (process.env.NODE_ENV === 'production') {
    wsPath = 'ws://119.91.139.245:9001';
    const {mockXHR} = require('../mock');
    mockXHR();
}

import SocketIO from 'socket.io-client';

import VueSocketIO from 'vue-socket.io';

const options = {
    autoConnect: false
};

Vue.use(new VueSocketIO({
    debug: true, // 调试模式，开启后将在命令台输出蓝色的相关信息
    connection: SocketIO(wsPath, options)
}));

// set ElementUI lang to EN
Vue.use(ElementUI, {locale});
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false;

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
});
