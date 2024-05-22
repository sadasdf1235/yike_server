const {addFriend} = require('../dao/dbserver');

//  好友申请
exports.addFriend = async (req) => {
    const {id, friendId, markname} = req.body;
    return await addFriend(id, friendId, markname);
}
