const {buildUser,countUser} = require('../mapper/dbserver');
const {encryption} = require('../mapper/encryption');

// 注册
exports.signUp = (req) => {
    let {username, password,email} = req.body;
    // 密码加密
    password = encryption(password);
    return buildUser(username, email,password);
};