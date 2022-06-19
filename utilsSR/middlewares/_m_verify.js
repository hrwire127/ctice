const UserError = require('../general/UserError');
const errorMessages = require('../rules/errorMessages');
const Pending = require("../../models/pending")
const Token = require("../../models/token")
const Comment = require("../../models/comment")

function verifyPendingCode(req, res, next) 
{
    Pending.findOne({
        confirmationCode: req.params.confirmationCode,
    })
        .then(async (pending) =>
        {
            if (!pending)
            {
                throw new UserError(...Object.values(errorMessages.pendingExpired)).throw_CS(res)
            }
            next()
        })
        .catch((err) => 
        {
            throw new UserError(err.message, err.status).throw_CS(res)
        });
};

function verifyPendingCode(req, res, next) 
{
    Pending.findOne({
        confirmationCode: req.params.confirmationCode,
    })
        .then(async (pending) =>
        {
            if (!pending)
            {
                throw new UserError(...Object.values(errorMessages.pendingExpired)).throw_CS(res)
            }
            next()
        })
        .catch((err) => 
        {
            throw new UserError(err.message, err.status).throw_CS(res)
        });
};

async function verifyResetToken(req, res, next) 
{
    if (req.params.confirmationCode)
    {
        Token.findOne({
            token: req.params.confirmationCode,
        })
            .then(async (token) =>
            {
                resolve(token)
                next()
            })
            .catch((err) => 
            {
                throw new UserError(err.message, err.status).throw_CS(res)
                reject(err)
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
        throw new UserError(...Object.values(errorMessages.didNotWork)).throw_CS(res)
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
    verifyPendingCode, verifyCommentUser, verifyResetToken,
    verifyPendingCode,
}