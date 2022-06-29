const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const { genToken } = require('../utilsSR/primary/_p_basic')
const nodemailer = require('../config/nodemailer')
const errorMessages = require("../utilsSR/rules/errorMessages")
const UserError = require('../utilsSR/general/userError');
const User = require("./user");
const Redirects_SR = require('../utilsSR/general/SR_Redirects');


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
            throw new UserError(...Object.values(errorMessages.emailAlreadyUsed)).throw_CS(res)
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
                throw new UserError(err.message, err.status)
                reject()
            })
        }
    })
}


TokenSchema.methods.resetPassword = async function (req, res, token, { user, password })
{
    if (token)
    {
        if (await User.findOne({ username: user.username }))
        {
            await user.setPassword(password)
            user.date.push(new Date())
            await user.save()
        }
        else
        {
            throw new UserError(...Object.values(errorMessages.userNotFound)).throw_CS(res)
        }
    }
    else
    {
        // new UserError(...Object.values(errorMessages.noPending)).setup(req, res);
        throw new UserError(...Object.values(errorMessages.userNotFound)).throw_CS(res)
    }
}

const Token = mongoose.model('Token', TokenSchema);

module.exports = Token;