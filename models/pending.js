const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const Rules = require('../utilsSR/rules/validRules')
const { genToken } = require('../utilsSR/primary/_p_basic')
const nodemailer = require('../config/nodemailer')
const errorMessages = require("../utilsSR/rules/errorMessages")
const UserError = require('../utilsSR/general/userError');
const User = require("./user");


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
        expires: 1920,
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
    this.date = new Date();
    return new Promise(async (resolve, reject) =>
    {
        this.confirmationCode = genToken()
        const Pending = mongoose.model('Pending');
        if (await Pending.findOne({ email: this.email })
            || await User.findOne({ email: this.email }))
        {
            throw new UserError(...Object.values(errorMessages.emailAlreadyUsed)).throw_CS(res)
        }
        else if (await User.findOne({ username: this.username }))
        {
            throw new UserError(...Object.values(errorMessages.usernameAlreadyUsed)).throw_CS(res)
        }
        else
        {
            nodemailer.sendRegisterEmail(
                this.username,
                this.email,
                this.confirmationCode
            ).then(async (res) =>
            {
                console.log(res)
                resolve();
            }).catch((err) =>
            {
                throw new UserError(err.message, err.status)
                reject()
            })
        }
    })
}

const Pending = mongoose.model('Pending', PendingSchema);

module.exports = Pending;