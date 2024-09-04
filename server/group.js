const { createGroup, addFriendToGroup, getGroupInfo, getGroupMemberList } = require('../mapper/groupMapper');

// 新建群
exports.createGroup = async (req) => {
    let { id, name, avatar } = req.body;
    return await createGroup(id, name, avatar);
}

// 添加好友到群
exports.addFriendToGroup = async (req) => {
    let { id, friendId, groupId } = req.body;
    return await addFriendToGroup(friendId, groupId);
}

// 获取群信息
exports.getGroupInfo = async (req) => {
    let { id, groupId } = req.query;
    let [group, memberList] = await Promise.all([getGroupInfo(groupId), getGroupMemberList(groupId)]);
    return { ...group, memberList };
}