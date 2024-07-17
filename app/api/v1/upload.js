const qiniu = require('qiniu');
const {ak, sk, scope} = require('@/config/config').qiniu;
const ACCESS_KEY = ak;
const SECRET_KEY = sk;
const mac = new qiniu.auth.digest.Mac(ACCESS_KEY, SECRET_KEY);

const {Auth} = require('@middlewares/auth');
const AUTH_ADMIN = 16;

const {Resolve} = require('@lib/helper');
const res = new Resolve();

const Router = require('koa-router');

const router = new Router({
    prefix: '/api/v1'
});

// 获取token
router.post('/upload/token', new Auth(AUTH_ADMIN).m, async ctx => {
    const options = {
        scope,
        expires: 7200
    };
    const putPolicy = new qiniu.rs.PutPolicy(options);
    ctx.response.status = 200;
    const data = {
        token: putPolicy.uploadToken(mac)
    };
    ctx.body = res.json(data);
});

module.exports = router;
