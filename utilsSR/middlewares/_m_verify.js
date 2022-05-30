const Redirects_CS = require("../../utilsCS/CS_Redirects")
const userError = require('../general/userError');
const errorMessages = require('../rules/errorMessages');
const Pending = require("../../models/pending")
const Token = require("../../models/token")
const Comment = require("../../models/comment")

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

async function verifyCommentUser(req, res, next)
{
    let comment = await Comment.findOne({ _id: req.params.cid, status: "Active" }).populate({
        path: 'author',
    })
    if (comment.author.username === req.session.passport.user)
    {
        next()
    }
    Redirects_CS.Error.CS(res)
}

module.exports = {
    verifyPending, verifyCommentUser, verifyTokenReset,
    verifyConfirmCode, verifyPendingCode, verifyTokenChange,
}