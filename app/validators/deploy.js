const {Rule, LinValidator} = require('@core/lin-validator-v2');

class DeployValidator extends LinValidator {
    constructor() {
        super();
        this.kw = [
            // 用户密码指定范围
            new Rule('isLength', '搜索内容至少1个字符，最多50个字符', {
                min: 1,
                max: 50
            })
        ];
    }
}

module.exports = {
    DeployValidator
};
