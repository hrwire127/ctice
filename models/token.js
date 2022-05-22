const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const { Rules } = require('../utilsSR/val-Rule')
const { genToken } = require('../utilsSR/_secondary')
const nodemailer = require('../config/nodemailer')
const errorMessages = require("../utilsSR/errorMessages")
const userError = require('../utilsSR/userError');
const User = require("./user");


const TokenSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    token: {
        type: String,
        default: genToken(),
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 120,
    }
});


TokenSchema.methods.processReset = async function (req, res)
{
    return new Promise(async (resolve, reject) =>
    {
        const Token = mongoose.model('Token', TokenSchema);
        if (await Token.findOne({ email: this.user.email }))
        {
            new userError(...Object.values(errorMessages.emailAllreadyUsed)).throw_CS(res)
            reject();
        }
        else
        {
            nodemailer.sendResetEmail(
                this.user.username,
                this.user.email,
                this.token
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


TokenSchema.methods.reset = async function (req, res, token, { user, password })
{
    if (token)
    {
        // if (Math.abs(date2 - date1) <= process.env.NEXT_PUBLIC_ACCOUNT_EDIT_DELAY)
        // {
        //     new userError(...Object.values(errorMessages.delayed)).setup(req, res);
        // }
        // else 
        if (await User.findOne({ username: user.username }))
        {
            await user.setPassword(password)
            user.date.push(new Date())
            await user.save()
        }

        else
        {
            new userError(...Object.values(errorMessages.userNotFound)).throw_CS(res)
        }
    }
    else
    {
        new userError(...Object.values(errorMessages.noPending)).setup(req, res);
        Redirects_SR.Error.CS(res)
    }
}

const Token = mongoose.model('Token', TokenSchema);

module.exports = Token;