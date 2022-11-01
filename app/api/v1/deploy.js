/**
 * @description 部署服务
 * @description Administrator's routing API interface
 * @author Aliez
 */

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
    console.log('🚀 > ctx123', ctx.socketIo)
    // 通过验证器校验参数是否通过
    const v = await new DeployValidator().validate(ctx);

    // 搜索写真
    const [err, data] = await Deploy.runSh({
        kw: v.get('body.kw'),
        socketIo:ctx.socketIo
    });
    console.log('🚀 > data',err, data);

    if (!err) {
        // 返回结果
        ctx.response.status = 200;
        ctx.body = res.json(data);
    } else {
        ctx.body = res.fail(err);
    }
});

module.exports = router;
