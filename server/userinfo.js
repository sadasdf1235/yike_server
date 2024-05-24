const { userUpdate,  userDetail, friendMarkName } = require('../mapper/dbserver');

// 更新用户信息
exports.updateUserInfo = async (req) => {
    return await userUpdate(req.body);
}

// 获取用户详情
exports.getUserInfo = async (req) => {
    return await userDetail(req.query.id);
}