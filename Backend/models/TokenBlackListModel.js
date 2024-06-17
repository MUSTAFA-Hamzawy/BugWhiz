// This model to handle logout ( make a token expired even if before its expiration time)

const mongoose = require('mongoose');

const TokenBlackListModel = new mongoose.Schema({
    token : {
        type: String
    }
});

module.exports = mongoose.model("tokenBlackList", TokenBlackListModel);