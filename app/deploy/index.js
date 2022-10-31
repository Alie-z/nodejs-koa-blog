const path = require("path");
const runCmd = require("../lib/runCmd.js");
const logger = require("../lib/logger.js");


class Deploy {
    // 执行部署脚本
    // koa 注意异步 404 的问题
    static async runSh(params) {
        const {kw} = params;
        console.log('🚀 > send > kw', kw);
        let shPath = path.join(__dirname ,"../../sh/demo.sh");
        switch (kw) {
            case 'serves':
                shPath = path.join(__dirname ,"../../sh/serves.sh");
                break;
            case 'admin':
                shPath = path.join(__dirname ,"../../sh/admin.sh");
                break;
            case 'frontend':
                shPath = path.join(__dirname ,"../../sh/frontend.sh");
                break;
            default:
                break;
        }
        console.log('🚀 > runSh > shPath', shPath)
        return new Promise((resolve, reject) => {
            try {
              runCmd(
                "sh",
                [shPath],
                function (text) {
                  resolve([null,text]);
                },
                // socketIo
              );
            } catch (e) {
              logger.info(e);
              reject([e,null]);
            }
          });
    }

}

module.exports = {
    Deploy
};