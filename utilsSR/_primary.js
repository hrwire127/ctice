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
    sendEmail, getUser
}