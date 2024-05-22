const nodemailer = require("nodemailer");
const certificate = require('../config/certificate');

const transporter = nodemailer.createTransport({
  service: "qq",
  auth: {
    user: certificate.auth.user,
    pass: certificate.auth.pass,
  },
});

exports.emailSignUp = async (email,res) => {
    const info = {
        from: certificate.auth.user,
        to: email, 
        subject: "感谢您在yeki进行注册",
        text: "Hello world?", 
        html: "<b>Hello world?</b>",
      };

    transporter.sendMail(info,(err,data)=>{
        if(err){
            console.log(err);
            res.send({
                code: 500,
                msg: "邮件发送失败"
            })
        }else{
            res.send({
                code: 200,
                msg: "邮件发送成功"
            })
        }
    })
}
