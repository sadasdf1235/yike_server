// 密码加密与解密
const bcrypt = require('bcrypt');

exports.encryption = function(pas){
    let salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(pas, salt);
}
exports.compare = function(pas, hash){
    return bcrypt.compareSync(pas, hash);
}