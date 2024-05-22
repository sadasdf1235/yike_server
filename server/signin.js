const {findUser} = require('../dao/dbserver');
const { compare } = require('../dao/encryption');
const { createToken } = require('../dao/jwt');

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