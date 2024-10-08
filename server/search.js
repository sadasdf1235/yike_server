const { searchUser } = require('../mapper/userMapper');
const { isFriend } = require('../mapper/friendMapper');
const { searchGroup, isInGroup } = require('../mapper/groupMapper');

// 搜素
exports.search = async (req) => {
    let { keyword, id, type } = req.body;
    const flag = type === 'user';
    let list = flag ? await searchUser(keyword) : await searchGroup(keyword);
    if (!list.length) return;
    const copyList = [];
    for (const item of list) {
        const newItem = {
            id: item._id,
            username: item.username,
            email: item.email,
            avatar: item.avatar
        };
        if (flag) {
            newItem.isFriend = await isFriend(id, newItem._id);
        } else {
            newItem.isInGroup = await isInGroup(id, newItem._id);
        }
        copyList.push(newItem);
    }
    return copyList;
}