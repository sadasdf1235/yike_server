const jwt = require('jsonwebtoken');

const key = 'secret';

// 生成token
exports.createToken = (id) => {
    return jwt.sign({ id }, key, { expiresIn: 60 * 60 * 24 * 120 });
}
// 解码token
exports.decodeToken = (token) => {
    try {
        return jwt.verify(token, key);
    } catch (err) {
        // 解析或验证失败时，可以返回错误信息或自定义响应
        console.error('Error decoding token:', err);
        return null; // 或者返回一个错误对象，例如 { error: 'Invalid token' }
    }
};
