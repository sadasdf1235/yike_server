const dbmodel = require('../model/dbmodel.js');
const Message = dbmodel.model('Message');
const safe = require('../util/safe.js');

// 新建消息
exports.buildMessage = async function (userId, friendId, message, type,) {
    return safe(() => new Message({
        user_id: userId,
        friend_id: friendId,
        message,
        message_type: type,
        create_time: Date.now(), // 第一条消息创建的时间
    }).save());
}

// 获取最后一条聊天消息
exports.getLastMessage = async function (userId, friendId) {
    let wherestr = { $or: [{ user_id: userId, friend_id: friendId }, { user_id: friendId, friend_id: userId }] };
    let out = { message: 1, message_type: 1, create_time: 1 };
    return safe(() => Message.findOne(wherestr, out).sort({ create_time: -1 }).exec());
}

// 汇总未读消息数
exports.getUnreadMessageCount = async function (userId, friendId) {
    let wherestr = { user_id: userId, friend_id: friendId, status: 1 };
    return safe(() => Message.countDocuments(wherestr).exec());
}

// 消息状态修改
exports.updateMessageStatus = async function (userId, friendId) {
    let wherestr = { user_id: userId, friend_id: friendId, status: 1 };
    return safe(() => Message.updateMany(wherestr, { $set: { status: 2 } }).exec());
}