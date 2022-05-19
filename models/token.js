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
    typeOf: {
        type: String,
        enum: ["Reset", "Change"],
        required: true,
    }
});

async function process(req, res, typeOf)
{
    return new Promise(async (resolve, reject) =>
    {
        const Token = mongoose.model('Token', TokenSchema);
        if (await Token.findOne({ email: this.user.email, typeOf: typeOf }))
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

async function modify(req, res, token, { user, password }, typeOf)
{
    if (token)
    {
        if (await User.findOne({ username: user.username, typeOf: typeOf }))
        {
            await user.setPassword(password);
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


TokenSchema.methods.processReset = async function (req, res)
{
    // return new Promise(async (resolve, reject) =>
    // {
    //     const Token = mongoose.model('Token', TokenSchema);
    //     if (await Token.findOne({ email: this.user.email, typeOf: "Reset" }))
    //     {
    //         new userError(...Object.values(errorMessages.emailAllreadyUsed)).throw_CS(res)
    //         reject();
    //     }
    //     else
    //     {
    //         nodemailer.sendResetEmail(
    //             this.user.username,
    //             this.user.email,
    //             this.token
    //         ).then(async (res) =>
    //         {
    //             resolve();
    //         }).catch((err) =>
    //         {
    //             reject()
    //         })
    //     }
    // })
    await process(req, res, "Reset")
}


TokenSchema.methods.reset = async function (req, res, token, { user, password })
{
    // if (token)
    // {
    //     if (await User.findOne({ username: user.username, typeOf: "Reset" }))
    //     {
    //         await user.setPassword(password);
    //         await user.save()
    //     }
    //     else
    //     {
    //         new userError(...Object.values(errorMessages.userNotFound)).throw_CS(res)
    //     }
    // }
    // else
    // {
    //     new userError(...Object.values(errorMessages.noPending)).setup(req, res);
    //     Redirects_SR.Error.CS(res)
    // }

    await process(req, res, token, { user, password }, "Reset")
}


TokenSchema.methods.processChange = async function (req, res)
{//
    // return new Promise(async (resolve, reject) =>
    // {
    //     const Token = mongoose.model('Token', TokenSchema);
    //     if (await Token.findOne({ email: this.user.email, typeOf: "Change" }))
    //     {
    //         new userError(...Object.values(errorMessages.emailAllreadyUsed)).throw_CS(res)
    //         reject();
    //     }
    //     else
    //     {
    //         nodemailer.sendResetEmail(
    //             this.user.username,
    //             this.user.email,
    //             this.token
    //         ).then(async (res) =>
    //         {
    //             resolve();
    //         }).catch((err) =>
    //         {
    //             reject()
    //         })
    //     }
    // })

    await process(req, res, "Change")
}


TokenSchema.methods.change = async function (req, res, token, { user, password })
{//
    // if (token)
    // {
    //     if (await User.findOne({ username: user.username, typeOf: "Change" }))
    //     {
    //         await user.setPassword(password);
    //         await user.save()
    //     }
    //     else
    //     {
    //         new userError(...Object.values(errorMessages.userNotFound)).throw_CS(res)
    //     }
    // }
    // else
    // {
    //     new userError(...Object.values(errorMessages.noPending)).setup(req, res);
    //     Redirects_SR.Error.CS(res)
    // }
    
    await process(req, res, token, { user, password }, "Change")
}

const Token = mongoose.model('Token', TokenSchema);

module.exports = Token;