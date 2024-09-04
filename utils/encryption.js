// 密码加密与解密
const bcrypt = require('bcrypt');

exports.encryption = function (pas) {
    try {
        let salt = bcrypt.genSaltSync(10);
        return bcrypt.hashSync(pas, salt);
    } catch (error) {
        console.error(error);
    }
}
exports.compare = function (pas, hash) {
    try {
        return bcrypt.compareSync(pas, hash);
    } catch (error) {
        console.error(error);
    }
}