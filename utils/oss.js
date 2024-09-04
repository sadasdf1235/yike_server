const OSS = require('ali-oss');

// 初始化OSS客户端
const client = new OSS({
    region: 'xxxx',
    accessKeyId: 'xxxx',
    accessKeySecret: 'xxxx',
    bucket: 'xxxx',
    authorizationV4: true,
});

exports.aliUpload = async function (objectName, tempFilePath) {
    try {
        return await client.put(objectName, tempFilePath);
    } catch (e) {
        console.log(e);
    }
}
