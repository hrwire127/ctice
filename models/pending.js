const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const { Rules } = require('../utilsSR/val-Rule')


const PendingSchema = new Schema({
    username: {
        type: String,
        required: true,
        max: Rules.username_max_char,
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
        required: true
    },
    date:
    {
        type: String,
        max: Rules.date_length,
        required: true
    }
});

PendingSchema.pre('save', function (next)
{
    this.set({ title: this.title.trim() });
    this.set({ username: this.username.trim() });
    next();
})

module.exports = mongoose.model('Pending', PendingSchema)