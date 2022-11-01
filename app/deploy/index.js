const path = require("path");
const runCmd = require("../lib/runCmd.js");
const logger = require("../lib/logger.js");

function aa () {
  const a = '23';
   const b = '23';
}
class Deploy {
    // 执行部署脚本
    // koa 注意异步 404 的问题
    static async runSh(params) {
        const {kw,socketIo} = params;
        console.log('🚀 > send > kw', kw);
        let shPath = path.join(__dirname ,"../../sh/demo.sh");
        switch (kw) {
            case 'servers':
                shPath = path.join(__dirname ,"../../sh/servers.sh");
                break;
            case 'admin':
                shPath = path.join(__dirname ,"../../sh/admin.sh");
                break;
            case 'frontend':
                shPath = path.join(__dirname ,"../../sh/frontend.sh");
                break;
            case 'install':
                shPath = path.join(__dirname ,"../../sh/install.sh");
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
                socketIo,
                kw
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