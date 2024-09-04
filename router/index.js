const path = require('path');
const fs = require('fs');
const { emailSignUp } = require('../utils/emailserver.js');
const { search } = require('../server/search.js');
const { updateUserInfo, updateFriendMarkName, getUserInfo, signUp, signIn } = require('../server/user.js');
const { addFriend, agreeFriend, deleteFriend } = require('../server/friend.js');
const { upload } = require('../utils/files.js');
const { aliUpload } = require('../utils/oss.js');
const { generateUuid } = require('../utils/uuid.js');
const { getChatList } = require('../server/chat.js');

class Result {
    constructor(code, msg, data) {
        this.code = code;
        this.msg = msg;
        this.data = data;
    }
    static success(msg = 'success', data) {
        return new Result(200, msg, data);
    }
}

module.exports = function (app) {

    //  注册
    app.post('/signup', async (req, res) => {
        const result = await signUp(req);
        if (result && result instanceof Object) {
            // TODO 发送邮件
            // emailSignUp(req.body.email);
            res.send(Result.success());
        } else {
            res.send(new Result(400, result));
        }
    })

    // 登录
    app.post('/signin', async (req, res) => {
        const result = await signIn(req);
        if (result && result.status) {
            res.send(Result.success('登录成功', result.data));
        } else {
            res.send(new Result(400, result.msg || '登录失败'));
        }
    })

    // 搜素
    app.post('/search', async (req, res) => {
        const result = await search(req);
        if (result) {
            res.send(Result.success(undefined, result));
        } else {
            res.send(new Result(400, '搜索失败'));
        }
    })

    // 用户信息更新
    app.post('/userinfo', async (req, res) => {
        const result = await updateUserInfo(req);
        if (result.msg) {
            res.send(new Result(400, result.msg));
            return;
        }
        res.send(Result.success(undefined, result));
    })

    // 获取用户信息
    app.get('/userinfo', async (req, res) => {
        const result = await getUserInfo(req);
        if (result) {
            res.send(Result.success(undefined, result));
        }else {
            res.send(new Result(400, '获取失败'));
        }
    })

    // 修改好友信息
    app.post('/updateFriend', async (req, res) => {
        const result = await updateFriendMarkName(req);
        if (result) {
            res.send(Result.success(undefined, result));
        } else {
            res.send(new Result(400, '修改失败'));
        }
    })

    // 好友申请
    app.post('/friend/apply', async (req, res) => {
        const result = await addFriend(req);
        if (result) {
            res.send(Result.success(undefined, result));
        }
    })

    // 同意好友
    app.post('/friend/agree', async (req, res) => {
        const result = await agreeFriend(req);
        console.log(result);
        if (result.code) {
            res.send(Result.success(undefined, result));
        } else {
            res.send(new Result(400, result.msg));
        }
    })

    // 删除/拒绝好友
    app.post('/friend/delete', async (req, res) => {
        const result = await deleteFriend(req);
        if (result.code) {
            res.send(Result.success(undefined, result));
        } else {
            res.send(new Result(400, result.msg));
        }
    })

    // 图片上传
    app.post('/upload', upload.array('files', 9), async function (req, res) {
        try {
            const files = req.files;
            const imagesUrl = [];

            // 遍历每个上传的文件
            for (let file of files) {
                // 获取文件的原始名称和临时存储路径
                // const originalFilename = file.originalname;
                const originalFilename = `${generateUuid()}.${path.extname(file.originalname)}`;
                const tempFilePath = file.path;
                console.log(tempFilePath)

                // 创建上传到OSS的文件名
                const objectName = path.basename(originalFilename);

                // 使用OSS客户端上传文件
                const result = await aliUpload(objectName, tempFilePath);

                console.log(`File ${originalFilename} uploaded successfully. URL: ${result.url}`);
                imagesUrl.push(result.url);

                // 删除本地的临时文件
                fs.unlinkSync(tempFilePath);
            }
            res.send(Result.success('Files uploaded successfully.', imagesUrl));
        } catch (err) {
            console.error('Error uploading files:', err);
            res.send(new Result(400, 'Failed to upload files.'));
        }
    });

    // 获取聊天列表（包括好友和群聊)
    app.get('/chat/list', async (req, res) => {
        const result = await getChatList(req);
        if (result) {
            res.send(Result.success(undefined, result));
        } else {
            res.send(new Result(400, '获取列表失败'));
        }
    })
}