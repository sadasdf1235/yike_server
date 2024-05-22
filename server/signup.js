const {buildUser,countUser} = require('../dao/dbserver');
const {encryption} = require('../dao/encryption');

// 注册
exports.signUp = (req) => {
    let {username, password,email} = req.body;
    // 密码加密
    password = encryption(password);
    return buildUser(username, email,password);
};