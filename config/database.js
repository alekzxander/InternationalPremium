// config/database.js
require('dotenv').load();
module.exports = {
    'url' : process.env.DATA 
    // 'url' : 'mongodb://localhost:27017/voyage'
};