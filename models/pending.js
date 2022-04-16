const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const PendingSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    confirmationCode: {
        type: String,
        required: true,
        unique: true
    },
    expireAt: {
        type: Date,
        default: Date.now,
        index: { expires: '20m' },
    },
});

module.exports = mongoose.model('Pending', PendingSchema)