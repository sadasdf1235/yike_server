const { userUpdate,  userDetail, buildUser, findUser } = require('../mapper/userMapper');
const {encryption, compare} = require('../utils/encryption');
const { createToken } = require('../utils/jwt');

// 注册
exports.signUp = (req) => {
    let {username, password,email} = req.body;
    // 密码加密
    password = encryption(password);
    return buildUser(username, email,password);
};

// 登录
exports.signIn = async (req) => {
    let {voucher, password} = req.body;
    const isEmail = voucher.includes('@');
    let wherestr = isEmail ? { 'email': voucher } : { 'username': voucher };
    let res = await findUser(wherestr);
    if(res.status){
        let result = res.data;
        // 验证密码
        const flag = compare(password, result.password);
        return flag ? {
            status: true, data: {
                username: result.username,
                avatar: result.avatar,
                id: result._id,
                token: createToken(result._id)
            }
        } : { status: false, msg: '密码错误' };
    }
    return res;
};

// 更新用户信息
exports.updateUserInfo = async (req) => {
    return await userUpdate(req.body);
}

// 获取用户详情
exports.getUserInfo = async (req) => {
    return await userDetail(req.query.id);
}