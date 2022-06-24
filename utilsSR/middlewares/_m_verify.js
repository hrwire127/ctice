const UserError = require('../general/UserError');
const errorMessages = require('../rules/errorMessages');
const Pending = require("../../models/pending")
const Token = require("../../models/token")
const Comment = require("../../models/comment")

function verifyPendingCode_SR(req, res, next) 
{
    Pending.findOne({
        confirmationCode: req.params.confirmationCode,
    })
        .then(async (pending) =>
        {
            if (!pending)
            {
                req.type = 0
                return new UserError(...Object.values(errorMessages.pendingExpired)).throw_SR(req, res)
            }
            next()
        })
        .catch((err) => 
        {
            req.type = 0
            next(new UserError(err.message, err.status))
        });
};

async function verifyResetToken_SR(req, res, next) 
{
    if (req.params.confirmationCode)
    {
        Token.findOne({
            token: req.params.confirmationCode,
        })
            .then(async (token) =>
            {
                next()
            })
            .catch((err) => 
            {
                req.type = 0
                next(new UserError(err.message, err.status))
            });
    }
    else if (req.body.confirmationCode)
    {
        if (await Token.findOne({ token: req.body.confirmationCode }))
        {
            next()
        }
    }
    else
    {
        req.type = 0
        throw new UserError(...Object.values(errorMessages.didNotWork)).throw_SR(req, res)
    }
};


async function verifyCommentUser(req, res, next)
{
    let comment = await Comment.findOne({ _id: req.params.cid, status: "Active" }).populate({
        path: 'author',
    })
    if (comment.author.username === req.session.passport.user)
    {
        next()
    }
    throw new UserError(...Object.values(errorMessages.didNotWork)).throw_CS(res)
}

module.exports = {
    verifyPendingCode_SR, verifyCommentUser, verifyResetToken_SR,
    verifyPendingCode_SR,
}