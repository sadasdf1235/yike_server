const {getFriendList} = require('../mapper/friendMapper.js');
const {getGroupList} = require('../mapper/groupMapper.js');

// 获取聊天列表
exports.getChatList = async ({ query: { id } }) => {
    const [friendList, groupList] = await Promise.all([getFriendList(id), getGroupList(id)]);
    return friendList.concat(groupList);
}