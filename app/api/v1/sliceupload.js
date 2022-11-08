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

