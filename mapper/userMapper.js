const dbmodel = require('../model/dbmodel.js');
const User = dbmodel.model('User');
const safe = require('../utils/safe.js');

// 匹配用户
const countUser = async function (data, type) {
    return safe(() => User.countDocuments({ [type]: data }));
}

// 新建用户
exports.buildUser = async function (username, email, password) {
    if (await countUser(username, 'username')) {
        return '用户名已存在';
    } else if (await countUser(email, 'email')) {
        return '邮箱已存在';
    }
    return safe(() => new User({
        username,
        email,
        password,
    }).save());
}

// 查找用户
exports.findUser = async function (wherestr) {
    let out = 'username password avatar';
    let result = await safe(() => User.findOne(wherestr).select(out).exec());
    if (result) return { status: true, data: result };
    return {
        status: false,
        msg: wherestr['email'] === '' ? '邮箱不存在' : '用户名不存在'
    }
}

// 搜素用户
exports.searchUser = async function (data) {
    let wherestr = { $or: [{ username: { $regex: data } }, { email: { $regex: data } }] };
    let out = 'username email avatar';
    return safe(() => User.find(wherestr).select(out).exec());
}

// 用户详情
exports.userDetail = async function (userId) {
    let wherestr = { _id: userId };
    let out = { password: 0 };
    return safe(() => User.findOne(wherestr).select(out).exec());
}

// 用户资料修改 {id:'',username:'',email:'',avatar:'',phone:'',sex:'',explain:''，password:'',newPassword:''}
exports.userUpdate = async function (data) {
    let wherestr = { _id: data.id };
    let result = await safe(() => User.findOne(wherestr).exec());
    if (!result) {
        return { msg: '用户不存在' };
    }
    // 用户名、邮箱、手机号不能重复
    const checks = [
        { field: 'username', value: data.username },
        { field: 'email', value: data.email },
        { field: 'phone', value: data.phone },
    ];
    const existingFields = await Promise.all(
        checks.map(async ({ field, value }) => countUser(field, value))
    );
    const conflictFields = existingFields.filter(Boolean);
    if (conflictFields.length) {
        return {
            msg: `以下字段已存在：${conflictFields.join(', ')}`,
        };
    }
    // 构建更新操作
    const updateOps = {};
    for (const key in data) {
        if (key !== 'id' && data[key]) { // 忽略id字段和空值
            updateOps[key] = data[key];
        }
    }
    // 密码字段存在 修改密码
    if (data.password && data.newPassword) {
        if (!await compare(data.password, result.password)) {
            return {
                msg: '旧密码错误'
            };
        }
        // 旧密码与新密码不能一致
        if (data.password === data.newPassword) {
            return {
                msg: '新密码不能与旧密码一致'
            };
        }
        delete updateOps.newPassword;
        updateOps.password = await encryption(data.newPassword);
    }
    // 更新信息
    safe(() => User.findByIdAndUpdate(
        data.id,
        { $set: updateOps },
        { new: true }
    ));
    return safe(() => User.findById(data.id).select('-password -__v'));
}