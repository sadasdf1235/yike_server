const { emailSignUp } = require('../mapper/emailserver.js');
const {signUp} = require('../server/signup.js')
const {signIn} = require('../server/signin.js');
const {search} = require('../server/search.js');
const {updateUserInfo,updateFriendMarkName,getUserInfo} = require('../server/userinfo.js');
const {addFriend,agreeFriend,deleteFriend} = require('../server/friend.js');

class Result {
    constructor(code,msg,data){
        this.code = code;
        this.msg = msg;
        this.data = data;
    }
    static success(msg = 'success',data){
        return new Result(200,msg,data);
    }
}

module.exports = function(app){

    //  注册
    app.post('/signup',async (req,res)=>{
        const result = await signUp(req);
        if(result && result instanceof Object){
            // 发送邮件
            // emailSignUp(req.body.email);
            res.send(Result.success());
        }else {
            res.send(new Result(400,result));
        }
    })

    // 登录
    app.post('/signin',async (req,res)=>{
        const result = await signIn(req);
        if(result && result.status){
            res.send(Result.success('登录成功',result.data));
        }else {
            res.send(new Result(400,result.msg || '登录失败'));
        }
    })

    // 搜素
    app.post('/search',async (req,res)=>{
        const result = await search(req);
        if(result){
            res.send(Result.success(undefined,result));
        }
    })

    // 用户信息更新
    app.post('/userinfo',async (req,res)=>{
        const result = await updateUserInfo(req);
        if(result.msg){
            res.send(new Result(400,result.msg));
            return;
        }
        res.send(Result.success(undefined,result));
    })

    // 获取用户信息
    app.get('/userinfo',async (req,res)=>{
        const result = await getUserInfo(req);
        if(result){
            res.send(Result.success(undefined,result));
        }
    })

    // 修改好友信息
    app.post('/updateFriend',async (req,res)=>{
        const result = await updateFriendMarkName(req);
        if(result){
            res.send(Result.success(undefined,result));
        }
    })

    // 好友申请
    app.post('/friend/apply',async (req,res)=>{
        const result = await addFriend(req);
        if(result){
            res.send(Result.success(undefined,result));
        }
    })

    // 同意好友
    app.post('/friend/agree',async (req,res)=>{
        const result = await agreeFriend(req);
        console.log(result);
        if(result.code){
            res.send(Result.success(undefined,result));
        }else{
            res.send(new Result(400,result.msg));
        }
    })

    // 删除/拒绝好友
    app.post('/friend/delete',async (req,res)=>{
        const result = await deleteFriend(req);
        if(result.code){
            res.send(Result.success(undefined,result));
        }else {
            res.send(new Result(400,result.msg));
        }
    })
}