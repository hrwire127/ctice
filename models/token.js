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
    },
});


TokenSchema.methods.processPending = async function (req, res)
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
            console.log(this.user.username)
            console.log(this.user.email)
            console.log(this.token)
            nodemailer.sendConfirmationEmail(
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

const Token = mongoose.model('Token', TokenSchema);

module.exports = Token;