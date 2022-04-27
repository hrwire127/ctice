const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const { Rules } = require('../utilsSR/val-Rule')
const { genToken } = require('../utilsSR/_secondary')
const User = require("./user");
const nodemailer = require('../config/nodemailer')
const errorMessages = require("../utilsSR/errorMessages")
const userError = require('../utilsSR/userError');


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
        type: Date,
        required: true
    }
});


PendingSchema.methods.processPending = async function (req, res)
{
    return new Promise(async (resolve, reject) =>
    {
        this.confirmationCode = genToken()
        const Pending = mongoose.model('Pending');
        if (await Pending.findOne({ email: this.email }) || await User.findOne({ email: this.email }))
        {
            new userError(...Object.values(errorMessages.emailAllreadyUsed)).throw_CS(res)
            reject();
        }
        else if (
            // await Pending.findOne({ username: this.username }) || 
            await User.findOne({ username: this.username })
        )
        {
            new userError(...Object.values(errorMessages.usernameAllreadyUsed)).throw_CS(res)
            reject();
        }
        else
        {
            nodemailer.sendConfirmationEmail(
                this.username,
                this.email,
                this.confirmationCode
            ).then(async (res) =>
            {
                resolve();
            }).catch((err) =>
            {
                reject()
            })
        }
    })
}


const Pending = mongoose.model('Pending', PendingSchema)

module.exports = Pending;