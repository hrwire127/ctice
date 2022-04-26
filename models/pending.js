const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const { Rules } = require('../utilsSR/val-Rule')
const { genToken } = require('../utilsSR/_secondary')
const User = require("./user");
const nodemailer = require('../config/nodemailer')
const errorMessages = require("../utilsSR/errorMessages")


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

const Pending = mongoose.model('Pending', PendingSchema)

PendingSchema.methods.processPending = async function (req, res)
{
    this.confirmationCode = genToken()
    if (await Pending.findOne({ email }) || await User.findOne({ email }))
    {
        new userError(...Object.values(errorMessages.emailAllreadyUsed)).throw_CS(res)
    }
    else if (await Pending.findOne({ username }) || await User.findOne({ username }))
    {
        new userError(...Object.values(errorMessages.usernameAllreadyUsed)).throw_CS(res)
    }
    else
    {
        nodemailer.sendConfirmationEmail(
            this.username,
            this.email,
            this.confirmationCode
        ).then(async () =>
        {
            return;
        })
    }
}

module.exports = Pending;