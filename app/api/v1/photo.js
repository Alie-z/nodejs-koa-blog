/**
 * @description 管理员的路由 API 接口
 * @description Administrator's routing API interface
 * @author Aliez
 */

const Router = require('koa-router');

const {PhotoValidator} = require('@validators/photo');
const {PhotoCrawler} = require('@crawler/photo.js');
const {Resolve} = require('@lib/helper');
const res = new Resolve();

const router = new Router({
    prefix: '/api/v1/photo'
});

//
router.post('/search', async ctx => {
    // 通过验证器校验参数是否通过
    const v = await new PhotoValidator().validate(ctx);

    // 搜索写真
    const [err, data, hasMore] = await PhotoCrawler.getPhoto({
        kw: v.get('body.kw'),
        page: v.get('body.page')
    });

    if (!err) {
        // 返回结果
        ctx.response.status = 200;
        ctx.body = res.json(data, void 0, void 0, void 0, hasMore);
    } else {
        ctx.body = res.fail(err);
    }
});

module.exports = router;
