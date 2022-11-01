const Koa = require('koa');
const InitManager = require('./core/init');
const parser = require('koa-bodyparser');
const cors = require('@koa/cors');
const ratelimit = require('koa-ratelimit');

require('module-alias/register');

const catchError = require('./middlewares/exception');

const app = new Koa();

app.use(cors());
app.use(catchError);
app.use(parser());

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

app.listen(9000, () => {
    console.log('Koa is listening in http://localhost:9000');
});

module.exports = app;
