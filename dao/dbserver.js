
// 数据处理

const dbmodel = require('../model/dbmodel.js');
const User = dbmodel.model('User');
const Friend = dbmodel.model('Friend');
const Group = dbmodel.model('Group');
const GroupMember = dbmodel.model('GroupMember');
const { encryption, compare } = require('../dao/encryption.js');
const { createToken } = require('./jwt.js')

// 新建用户
exports.buildUser = async function (username, email, password) {
    console.log(username, email, password)
    try {
        if (await countUser(username, 'username')) {
            return '用户名已存在';
        } else if (await countUser(email, 'email')) {
            return '邮箱已存在';
        }
        return await new User({
            username,
            email,
            password,
        }).save();
    } catch (error) {
        throw error;
    }
}

// 匹配用户
const countUser = async function (data, type) {
    try {
        return await User.countDocuments({ [type]: data });
    } catch (err) {
        throw err;
    }
}

// 查找用户
exports.findUser = async function (wherestr) {
    try {
        let out = 'username password avatar';
        let result = await User.findOne(wherestr).select(out).exec();
        if (result) return { status: true, data: result };
        return {
            status: false,
            msg: wherestr['email'] === '' ? '邮箱不存在' : '用户名不存在'
        }

    } catch (err) {
        throw err;
    }
}

// 搜素用户
exports.searchUser = async function (data) {
    let wherestr = { $or: [{ username: { $regex: data } }, { email: { $regex: data } }] };
    let out = 'username email avatar';
    return await User.find(wherestr).select(out).exec();
}

// 判断是否为好友
exports.isFriend = async function (userId, friendId) {
    let wherestr = { user_id: userId, friend_id: friendId, status: '0' };
    return Boolean(await Friend.findOne(wherestr).exec());
}


// 搜素群组
exports.searchGroup = async function (name) {
    let wherestr = { name: { $regex: name } };
    let out = 'name desc avatar';
    return await Group.find(wherestr).select(out).exec();
}

// 判断是否在群组中
exports.isInGroup = async function (userId, groupId) {
    let wherestr = { user_id: userId, group_id: groupId };
    return Boolean(await GroupMember.findOne(wherestr).exec());
}

// 用户详情
exports.userDetail = async function (userId) {
    let wherestr = { _id: userId };
    let out = { password: 0 };
    return await User.findOne(wherestr).select(out).exec();
}

// 用户资料修改 {id:'',username:'',email:'',avatar:'',phone:'',sex:'',explain:''，password:'',newPassword:''}
exports.userUpdate = async function (data) {
    let wherestr = { _id: data.id };
    let result = await User.findOne(wherestr).exec();
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
    await User.findByIdAndUpdate(
        data.id,
        { $set: updateOps },
        { new: true } 
    );
    return await User.findById(data.id).select('-password -__v');
}


// 好友昵称修改  {id:'',friendId:'',markname:'' }
exports.friendMarkName = async function (data) {
    let wherestr = { user_id: data.id, friend_id: data.friendId };
    return await Friend.updateOne(wherestr, { $set: { markname: data.markname } }, { new: true }).exec();
}

// 新建好友
const buildFriend = async function (userId, friendId, markname, status) {
    return await new Friend({
        user_id: userId,
        friend_id: friendId,
        markname,
        create_time: Date.now(),
        status,
        last_time: Date.now()
    }).save();
}

// 修改好友申请的最后时间
const updateFriendLastTime = async function (userId, friendId) {
    let wherestr = { user_id: userId, friend_id: friendId };
    return await Friend.updateOne(wherestr, { $set: { last_time: Date.now() } }, { new: true }).exec();
}


// 添加好友
exports.addFriend = async function (userId, friendId, markname) {
    let wherestr = { user_id: userId, friend_id: friendId };
    let count = await Friend.countDocuments(wherestr).exec();
    // 0 未添加
    if (count == 0) {
        // 申请发送方
        buildFriend(userId, friendId, markname, 2);
        // 申请接受方
        buildFriend(friendId, userId, markname, 1);
    } else { // 已经发送申请，但是对方还未同意
        // 修改最后时间
        updateFriendLastTime(userId, friendId);
        updateFriendLastTime(friendId, userId);
    }
    return { msg: '已成功发送申请' };
}


// 新建消息
exports.buildMessage = async function (userId, friendId, message, type,) {
    return await new Message({
        user_id: userId,
        friend_id: friendId,
        message,
        message_type: type,
        create_time: Date.now(), // 第一条消息创建的时间
    }).save();
}