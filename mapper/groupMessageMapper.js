const dbmodel = require('../model/dbmodel.js');
const GroupMessage = dbmodel.model('GroupMessage')
const safe = require('../util/safe.js');

// 获取最后一条群消息
exports.getLastGroupMessage = async function (groupId) {
    let wherestr = { group_id: groupId };
    let out = { message: 1, message_type: 1, create_time: 1 };
    let result = await safe(() => GroupMessage.findOne(wherestr, out).populate('user_id', 'markname').sort({ create_time: -1 }).exec());
    if (result) {
        return {
            id: result._id,
            message: result.message,
            message_type: result.message_type,
            create_time: result.create_time,
            markname: result.user_id.markname
        };
    } else {
        return null;
    }
}

// 汇总群消息未读数
exports.getUnreadGroupMessageCount = async function (userId, groupId) {
    let wherestr = { user_id: userId, group_id: groupId, status: 1 };
    return safe(() => GroupMessage.countDocuments(wherestr));
}

// 群消息状态修改
exports.updateGroupMessageStatus = async function (userId, groupId) {
    let wherestr = { user_id: userId, group_id: groupId, status: 1 };
    return safe(() => GroupMessage.updateMany(wherestr, { $set: { status: 2 } }));
}