const { excRule } = require('./exc-Rule');
const userError = require('./userError');
const { cloud } = require('../cloud/storage');
const { Redirects_SR } = require('./SR_Redirects');
const User = require("../models/user");
const Pending = require("../models/pending")
const nodemailer = require('../config/nodemailer')
const errorMessages = require("./errorMessages")


function getUser(req, res)
{
    const session = req.session.passport
    if (session) 
    {
        return session.user;
    }
    Redirects_SR.Error.CS(res)
}


async function doRegister(req, res, func)
{
    const { confirmationCode, password } = req.body

    const pending = await Pending.findOne({ confirmationCode })
    if (pending)
    {
        const user = new User({
            username: pending.username,
            password,
            date: pending.date,
            email: pending.email,
            confirmationCode: confirmationCode,
            status: "Active",
        })
        await User.register(user, password)
        await Pending.findByIdAndDelete(pending._id)
        func()
    }
    else
    {
        new userError(...Object.values(errorMessages.noPending)).setup(req, res);
        Redirects_SR.Error.CS(res)
    }
}

async function sendEmail(pending)
{
    await nodemailer.sendConfirmationEmail(
        pending.username,
        pending.email,
        pending.confirmationCode
    )
}


module.exports =
{
    doRegister, sendEmail, getUser
}