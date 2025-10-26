const mongoose = require('mongoose');

const blacklistTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    blacklistedAt: {
        type: Date,
        default: Date.now,
        expires: '1d' // Token will be removed after 1 day
    }
});     
module.exports= mongoose.model('BlacklistToken', blacklistTokenSchema);