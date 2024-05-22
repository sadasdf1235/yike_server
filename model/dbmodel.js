const mongoose = require('mongoose');
const db = require('../config/db.js');

const Schema = mongoose.Schema;

// 用户表
const UserSchema = new Schema(
    {
        username: { type: String, required: true }, // 用户名
        password: { type: String, required: true },     // 密码
        email: { type: String, required: true },    // 邮箱
        avatar: { type: String, default: 'https://firstld.oss-cn-chengdu.aliyuncs.com/2.jpg' },  // 头像
        last_login_time: { type: Date, default: Date.now }, // 最后登录时间
        last_login_ip:{ type: String, default: '' },    // 最后登录ip
        status: { type: Number, default: 1 }, // 1:正常 2:禁用
        phone: { type: String, default: '' }, // 手机
        sex: { type: Number, default: 0 }, // 0:未知 1:男 2:女
        register: { type: Date, default: Date.now }, // 注册时间
        explain: { type: String, default: '' }, // 介绍
    },
);

// 好友表
const FriendSchema = new Schema(
    {
        user_id: { type: Schema.Types.ObjectId, ref: 'User' }, // 用户id
        friend_id: { type: Schema.Types.ObjectId, ref: 'User' }, // 好友id
        status: { type: Number, }, // 0:已为好友 1:申请中 2:申请发送方
        create_time: { type: Date, default: Date.now }, // 创建时间
        markname: { type: String, default: '' }, // 备注名
        last_time: { type: Date, default: Date.now }, 
    },
);

// 一对一消息表
const MessageSchema = new Schema(
    {
        user_id: { type: Schema.Types.ObjectId, ref: 'User' }, // 用户id
        friend_id: { type: Schema.Types.ObjectId, ref: 'User' }, // 好友id
        message: { type: String, required: true }, // 消息
        message_type: { type: Number, default: 1 }, // 消息类型 1:文本 2:图片 3:音频 4:视频
        create_time: { type: Date, default: Date.now }, // 创建时间
        status: { type: Number, default: 1 }, // 1:未读 2:已读
    },
);

// 群表
const GroupSchema = new Schema(
    {
        name: { type: String, required: true }, // 群名称
        avatar: { type: String, default: 'https://firstld.oss-cn-chengdu.aliyuncs.com/2.jpg' }, // 群头像
        desc: { type: String, default: '' }, // 群介绍
        create_time: { type: Date, default: Date.now }, // 创建时间
        last_time: { type: Date, default: Date.now },
        status: { type: Number, default: 1 }, // 1:正常 2:禁用
        user_id: { type: Schema.Types.ObjectId, ref: 'User' }, // 创建者id
        notice: { type: String, default: '' }, // 群公告
    },
);

// 群成员表
const GroupMemberSchema = new Schema(
    {
        user_id: { type: Schema.Types.ObjectId, ref: 'User' }, // 用户id
        group_id: { type: Schema.Types.ObjectId, ref: 'Group' }, // 群id
        tip: { type: Number, default: 0 }, // 未读消息数
        status: { type: Number, default: 1 }, // 1:正常 2:禁言 3:拉黑
        create_time: { type: Date, default: Date.now }, // 加入时间
        last_time: { type: Date, default: Date.now },
        shield: { type: Number, default: 0 }, // 0:不屏蔽群消息 1:屏蔽群消息
    },
);

// 群消息表
const GroupMessageSchema = new Schema(
    {
        user_id: { type: Schema.Types.ObjectId, ref: 'User' }, // 用户id
        group_id: { type: Schema.Types.ObjectId, ref: 'Group' }, // 群id
        message: { type: String, required: true }, // 消息
        message_type: { type: Number, default: 1 }, // 消息类型 1:文本 2:图片 3:音频 4:视频
        create_time: { type: Date, default: Date.now }, // 创建时间
        status: { type: Number, default: 1 }, // 1:未读 2:已读
    },
);

module.exports = mongoose.model('User', UserSchema);
module.exports = mongoose.model('Friend', FriendSchema);
module.exports = mongoose.model('Message', MessageSchema);
module.exports = mongoose.model('Group', GroupSchema);
module.exports = mongoose.model('GroupMember', GroupMemberSchema);
module.exports = mongoose.model('GroupMessage', GroupMessageSchema);
