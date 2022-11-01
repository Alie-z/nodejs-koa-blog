const path = require('path');
const fs = require('fs');
const runCmd = require('../lib/runCmd.js');
const logger = require('../lib/logger.js');
class Deploy {
    // 执行部署脚本
    // koa 注意异步 404 的问题
    static runSh(params) {
        const {kw, socketIo} = params;
        let shPath = path.join(__dirname, `../../sh/${kw}.sh`);
        return new Promise(resolve => {
            try {
                fs.access(shPath, fs.constants.F_OK, err => {
                    if (err) {
                        return resolve([`${shPath}该脚本不存在`, null]);
                    } else {
                        runCmd(
                            'sh',
                            [shPath],
                            text => {
                                resolve([null, text]);
                            },
                            socketIo,
                            kw
                        );
                    }
                });
            } catch (e) {
                logger.info(e);
                resolve([e, null]);
            }
        });
    }

}

module.exports = {
    Deploy
};
