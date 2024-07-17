const Koa = require('koa');
const path = require('path');
const InitManager = require('./core/init');
const cors = require('@koa/cors');
const ratelimit = require('koa-ratelimit');
const {koaBody} = require('koa-body');
const static = require('koa-static');

require('module-alias/register');

const catchError = require('./middlewares/exception');

const app = new Koa();
// 处理静态资源
app.use(
    static(__dirname + '/public', {
        // 默认为true  访问的文件为index.html  可以修改为别的文件名或者false
        index: false,
        // 是否同意传输隐藏文件
        hidden: false,
        // 如果为true，则在返回next()之后进行服务，从而允许后续中间件先进行响应
        defer: true
    })
);

app.use(cors());
app.use(catchError);
// koa-body 中间插件 文件提交及form-data
app.use(
    koaBody({
        formLimit: '1mb',
        multipart: true,
        formidable: {
            maxFileSize: 200 * 1024 * 1024,
            keepExtensions: true
        }
    })
);

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

// 接口调用频率限制（Rate-Limiting）
// Rate limiter middleware for koa.
// https://github.com/koajs/ratelimit
const db = new Map();
app.use(
    ratelimit({
        driver: 'memory',
        db: db,
        duration: 60000,
        errorMessage: 'Sometimes You Just Have to Slow Down.',
        id: ctx => ctx.ip,
        headers: {
            remaining: 'Rate-Limit-Remaining',
            reset: 'Rate-Limit-Reset',
            total: 'Rate-Limit-Total'
        },
        max: 100,
        disableHeader: false,
        whitelist: ctx => {
            // some logic that returns a boolean
        },
        blacklist: ctx => {
            // some logic that returns a boolean
        }
    })
);

InitManager.initCore(app);

app.listen(8888, () => {
    console.log('Koa is listening in http://localhost:9000');
});

module.exports = app;
