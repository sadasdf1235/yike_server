const {addFriend,updateFriendStatus,deleteFriend} = require('../mapper/dbserver');

//  好友申请
exports.addFriend = async (req) => {
    const {id, friendId, markname} = req.body;
    return await addFriend(id, friendId, markname);
}

// 同意好友申请
exports.agreeFriend = async (req) => {
    const {id, friendId} = req.body;
    // 0 表示好友
    return await updateFriendStatus(id, friendId, 0);
}

// 删除/拒绝好友
exports.deleteFriend = async (req) => {
    const {id, friendId} = req.body;
    return await deleteFriend(id, friendId);
}