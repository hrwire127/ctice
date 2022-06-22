const Redirects_SR = require('../general/SR_Redirects');
const UserError = require('../general/UserError');
const errorMessages = require('../rules/errorMessages');
const User = require("../../models/user")

function isLogged_SR(req, res, next)
{
    if (!req.isAuthenticated())
    {
        Redirects_SR.Login.SR(res)
    }
    else
    {
        next()
    }
}

function isLogged_CS(req, res, next)
{
    if (!req.isAuthenticated())
    {
        Redirects_SR.Login.CS(res)
    }
    else
    {
        next()
    }
}

function isSessionReqUser(req, res, next)  //
{
    if (req.session.passport)
    {
        next()
    }
    else 
    {
        throw new UserError(...Object.values(errorMessages.userNotFound)).throw_CS(res)
    }
};

function isAdmin_SR(req, res, next)
{
    const session = req.session.passport

    if (session) 
    {
        if (session.user === process.env.NEXT_PUBLIC_ADMIN_USERNAME)
        {
            return next()
        }
    }
    req.type = 0
    throw new UserError(...Object.values(errorMessages.PageNotFound)).throw_SR(req, res)
}

function isAdmin_CS(req, res, next)
{
    const session = req.session.passport

    if (session) 
    {
        if (session.user === process.env.NEXT_PUBLIC_ADMIN_USERNAME)
        {
            return next()
        }
    }
    throw new UserError(...Object.values(errorMessages.PageNotFound)).throw_CS(res)
}

async function isSameUser(req, res, next) //
{
    const session = await User.findOne({ username: req.session.passport.user }, { username: 1 })

    if (req.body.id === session._id.valueOf())
    {
        next()
    }
    else
    {
        throw new UserError(...Object.values(errorMessages.didNotMatch)).throw_CS(res)
    }
}


module.exports = {
    isLogged_SR, isLogged_CS,
    isAdmin_SR, isAdmin_CS,
    isSessionReqUser, isSameUser
}