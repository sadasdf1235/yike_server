const dbmodel = require('../model/dbmodel.js');
const Friend = dbmodel.model('Friend');
const safe = require('../utils/safe.js');

// 判断是否为好友
exports.isFriend = async function (userId, friendId) {
    let wherestr = { user_id: userId, friend_id: friendId, status: '0' };
    return Boolean(await safe(() => Friend.findOne(wherestr).exec()));
}

// 新建好友
const buildFriend = async function (userId, friendId, markname, status) {
    return safe(() => new Friend({
        user_id: userId,
        friend_id: friendId,
        markname,
        create_time: Date.now(),
        status,
        last_time: Date.now()
    }).save());
}

// 修改好友申请的最后时间
const updateFriendLastTime = async function (userId, friendId) {
    let wherestr = { user_id: userId, friend_id: friendId };
    return safe(() => Friend.updateOne(wherestr, { $set: { last_time: Date.now() } }, { new: true }).exec());
}


// 添加好友
exports.addFriend = async function (userId, friendId, markname) {
    let wherestr = { user_id: userId, friend_id: friendId };
    let count = await safe(() => Friend.countDocuments(wherestr).exec());
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

// 好友昵称修改  {id:'',friendId:'',markname:'' }
exports.friendMarkName = async function (data) {
    let wherestr = { user_id: data.id, friend_id: data.friendId };
    return safe(() => Friend.updateOne(wherestr, { $set: { markname: data.markname } }, { new: true }).exec());
}

// 修改好友状态
exports.updateFriendStatus = async function (userId, friendId, status) {
    let wherestr = { $or: [{ user_id: userId, friend_id: friendId }, { user_id: friendId, friend_id: userId }] };
    /*
    matchedCount：一个整数，表示匹配到的文档数量。
    modifiedCount：一个整数，表示实际被修改的文档数量。
    */
    const result = await safe(() => Friend.updateMany(wherestr, { $set: { status } }).exec());
    if (result.modifiedCount > 0) {
        return { msg: '成功添加好友', code: 1 };
    } else {
        return { msg: '添加好友失败', code: 0 };
    }
}

// 删除好友
exports.deleteFriend = async function (userId, friendId) {
    let wherestr = { $or: [{ user_id: userId, friend_id: friendId }, { user_id: friendId, friend_id: userId }] };
    const result = await safe(() => Friend.deleteMany(wherestr).exec());
    // deletedCount：一个整数，表示被删除的文档数量。
    // 1 成功 0 失败
    if (result.deletedCount > 0) {
        return { msg: '删除好友成功', code: 1 };
    } else {
        return { msg: '删除好友失败', code: 0 };
    }
}

// TODO 获取好友列表
exports.getFriendList = async function (userId) {
    let wherestr = { user_id: userId, status: 0 };
    let out = { __v: 0, create_time: 0, status: 0 };
    // 按最后时间逆序
    let result = await safe(() => Friend.find(wherestr, out).populate('friend_id', 'avatar username').sort({ last_time: -1 }).exec());
    result = result.map(item => {
        if (!item.friend_id) item.friend_id = { username: '', avatar: '' };
        return {
            id: item._id,
            username: item.friend_id.username,
            avatar: item.friend_id.avatar,
            markname: item.markname,
            last_time: item.last_time,
        };
    });
    return result;
}