const mongoose = require('mongoose')
const passportLocalMongoose = require("passport-local-mongoose")
const Schema = mongoose.Schema;
const { Rules } = require('../utilsSR/val-Rule')


const UserSchema = new Schema({
    
    email: {
        type: String,
        required: true,
        max: Rules.email_max_char,
        unique: true
    },
    status: {
        type: String,
        required: true,
        enum: ['Disabled', 'Active'],
        default: 'Disabled'
    },
    confirmationCode: {
        type: String,
        unique: true,
        required: true,
    },
    date:
    {
        type: String,
        max: Rules.date_length,
        required: true
    }
});

UserSchema.pre('save', function (next)
{
    this.set({ email: this.email.trim() });
    next();
})

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema)