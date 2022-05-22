const { Redirects_SR } = require('./SR_Redirects');
const userError = require('./userError');
const errorMessages = require('./errorMessages');
const Pending = require("../models/pending")
const Token = require("../models/token")
const Comment = require("../models/comment")
const User = require("../models/user")
const Redirects_CS = require("../utilsCS/CS_Redirects")

async function hasDeclrs(req, res, next) 
{
    const { declarations } = req.body;

    if (!declarations) return Redirects_SR.Api.sendApi(res, [])

    next()
}

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

function tryAsync_SR(func)
{
    return function (req, res, next)
    {
        func(req, res, next).catch(err =>
        {
            new userError(err.message, err.status).throw_SR(req, res)
        })
    }
}

function tryAsync_CS(func)
{
    return function (req, res, next)
    {
        func(req, res, next).catch(err => next(err))
    }
}

function apiSecret(req, res, next)
{
    if (req.body.secret !== process.env.NEXT_PUBLIC_SECRET)
    {
        Redirects_SR.Error.CS(res)
    }
    next()
}

function verifyPending(req, res, next) 
{
    Pending.findOne({
        confirmationCode: req.params.confirmationCode,
    })
        .then(async (pending) =>
        {
            if (!pending)
            {
                new userError(...Object.values(errorMessages.pendingExpired)).throw_SR(req, res)
            }
            next()
        })
        .catch((err) => 
        {
            console.log(err)
            new userError(err.message, err.status).throw_SR(req, res)
        });
};

function verifyPendingCode(req, res, next) 
{
    Pending.findOne({
        confirmationCode: req.body.confirmationCode,
    })
        .then(async (pending) =>
        {
            if (!pending)
            {
                new userError(...Object.values(errorMessages.pendingExpired)).throw_SR(req, res)
            }
            next()
        })
        .catch((err) => 
        {
            console.log(err)
            new userError(err.message, err.status).throw_SR(req, res)
        });
};

async function verifyTokenReset(req, res, next) 
{
    const token = await verifyToken(req, res);
    if (!token) new userError(...Object.values(errorMessages.tokenExpired)).throw_SR(req, res)
    next()
};

async function verifyTokenChange(req, res, next) 
{
    const token = await verifyToken(req, res);
    if (!token) new userError(...Object.values(errorMessages.tokenExpired)).throw_SR(req, res)
    if (token.typeOf !== "Change") new userError(...Object.values(errorMessages.tokenExpired)).throw_SR(req, res)
    next()
};

function matchSessionUser(req, res, next) 
{
    if (req.session.passport)
    {
        next()
    }
    else 
    {
        new userError(...Object.values(errorMessages.userNotFound)).throw_SR(req, res)
    }
};

async function verifyConfirmCode(req, res, next)
{
    if (req.body.confirmationCode)
    {
        if (await Token.findOne({ token: req.body.confirmationCode }))
        {
            next()
        }
    }
    else 
    {
        new userError(...Object.values(errorMessages.didNotWork)).throw_SR(req, res)
    }
}

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
    new userError(...Object.values(errorMessages.PageNotFound)).throw_SR(req, res)
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
    Redirects_CS.Error.CS(res)
}

async function checkCommentUser(req, res, next)
{
    let comment = await Comment.findById(req.params.cid).populate({
        path: 'author',
    })
    if (comment.author.username === req.session.passport.user)
    {
        next()
    }
    Redirects_CS.Error.CS(res)
}

async function isSameUser(req, res, next)
{
    const session = await User.findOne({ username: req.session.passport.user }, { username: 1 })
    if (req.body.id === session._id)
    {
        next()
    }
    else
    {
        new userError(...Object.values(errorMessages.didNotMatch)).throw_SR(req, res)
    }
}

module.exports = {
    isLogged_SR, isLogged_CS, tryAsync_CS,
    tryAsync_SR, apiSecret, verifyPending,
    isAdmin_SR, isAdmin_CS, hasDeclrs,
    checkCommentUser, verifyTokenReset, matchSessionUser,
    tryAsync_CS, verifyConfirmCode, verifyPendingCode,
    verifyTokenChange, isSameUser
}