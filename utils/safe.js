module.exports = async function safeMongoQuery(query) {
    try {
        return await query();
    } catch (error) {
        console.error(error);
        return null; // 或者根据需要返回其他默认值
    }
}