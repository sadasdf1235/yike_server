const dbmodel = require('../model/dbmodel.js');
const Group = dbmodel.model('Group');
const GroupMember = dbmodel.model('GroupMember');
const User = dbmodel.model('User');
const safe = require('../utils/safe.js');

// 搜素群组
exports.searchGroup = async function (name) {
    let wherestr = { name: { $regex: name } };
    let out = 'name desc avatar';
    return safe(() => Group.find(wherestr).select(out).exec());
}

// 判断是否在群组中
exports.isInGroup = async function (userId, groupId) {
    let wherestr = { user_id: userId, group_id: groupId };
    return Boolean(await safe(() => GroupMember.findOne(wherestr).exec()));
}

// TODO 获取群列表 
exports.getGroupList = async function (userId) {
    let wherestr = { user_id: userId };
    let out = { create_time: 0, status: 0 };
    return safe(() => GroupMember.find(wherestr, out).sort({ last_time: -1 }).exec());
}

// 新建群
exports.createGroup = async function (userId, name, avatar) {
    let group = new Group({ name, avatar, user_id: userId });
    let exp = await safe(() => group.save());
    // 群主入群
    await addFriendToGroup(userId, exp._id);
    return {
        msg : '创建成功',
    };
}

// 添加好友入群
exports.addFriendToGroup = async function (userId, groupId) {
    let user = await safe(() => User.findOne({ _id: userId }).exec());
    let member = new GroupMember({ user_id: userId, group_id: groupId, markname: user.username });
    await safe(() => member.save());
    return {
        msg : '添加成功',
    };
}

// 获取群信息
exports.getGroupInfo = async function (groupId) {
    return safe(() => Group.findOne({ _id: groupId }).exec());
}

// 获取群成员列表
exports.getGroupMemberList = async function (groupId) {
    let wherestr = { group_id: groupId };
    let out = { user_id: 1, markname: 1, };
    return safe(() => GroupMember.find(wherestr, out).populate('user_id', 'avatar').exec());
}
