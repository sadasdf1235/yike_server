
const mongoose = require('mongoose');
let db;

main().catch(err => console.log(err));

async function main() {
  try {
    db = await mongoose.connect('mongodb://localhost:27017/yike');
  } catch (error) {
    throw error;
  }
}
module.exports = db;