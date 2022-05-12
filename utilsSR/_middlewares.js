const { Redirects_SR } = require('./SR_Redirects');
const Joi = require("joi").extend(require('@joi/date'));;
const userError = require('./userError');
const errorMessages = require('./errorMessages');
const Pending = require("../models/pending")
const Token = require("../models/token")
const Comment = require("../models/comment")
const User = require("../models/user")
const Redirects_CS = require("../utilsCS/CS_Redirects")
const { inspectDecrl, inspectUser, modifyDesc, inspectComment } = require('./_secondary')

async function validateDeclr(req, res, next) 
{
    let { title, description, date, file } = req.body

    const declarationSchema = Joi.object({
        title: Joi.string().required(),
        description: Joi.object({
            blocks: Joi.array().items(Joi.object().keys({
                key: Joi.string().required(),
                text: Joi.string().required().allow(''),
                type: Joi.string().required(),
                depth: Joi.number().required(),
                inlineStyleRanges: Joi.array().required(),
                entityRanges: Joi.array().required(),
                data: Joi.object().required()
            })),
            entityMap: Joi.object().required()
        }).required(),
        file: Joi.string(),
        date: Joi.date().iso()
    })

    const preparedBody =
    {
        title, description: JSON.parse(description), file, date: new Date(date)
    }

    const { error } = declarationSchema.validate(preparedBody)

    if (error) 
    {
        console.log(error)
        const msg = error.details.map(e => e.message).join(',')
        return new userError(msg, 401).throw_CS(res)
    }


    const bodyError = inspectDecrl(title, JSON.parse(description), req.files)

    if (bodyError) 
    {
        return new userError(bodyError, 401).throw_CS(res)
    }

    req.body.title = title.trim()
    req.body.description = JSON.stringify(modifyDesc(JSON.parse(description)))
    // req.body.author = getUser(req, res)

    next()
}

async function validateComment(req, res, next)
{
    let { content, date } = req.body

    const commentSchema = Joi.object({
        content: Joi.object({
            blocks: Joi.array().items(Joi.object().keys({
                key: Joi.string().required(),
                text: Joi.string().required().allow(''),
                type: Joi.string().required(),
                depth: Joi.number().required(),
                inlineStyleRanges: Joi.array().required(),
                entityRanges: Joi.array().required(),
                data: Joi.object().required()
            })),
            entityMap: Joi.object().required()
        }).required(),
        date: Joi.date().iso()
    })

    const preparedBody =
    {
        content: JSON.parse(content), date: new Date(date)
    }

    const { error } = commentSchema.validate(preparedBody)

    if (error) 
    {
        console.log(error)
        const msg = error.details.map(e => e.message).join(',')
        return new userError(msg, 401).throw_CS(res)
    }


    const bodyError = inspectComment(JSON.parse(content))

    if (bodyError) 
    {
        return new userError(bodyError, 401).throw_CS(res)
    }

    req.body.content = JSON.stringify(modifyDesc(JSON.parse(content)))

    next()
}

async function hasDeclrs(req, res, next) 
{
    const { declarations } = req.body;

    if (!declarations) return Redirects_SR.Api.sendApi(res, [])

    next()
}

async function validateApiQuery(req, res, next) 
{
    const { query } = req.body;

    if (query === undefined || query === null) return Redirects_SR.Api.sendApi(res, [])

    next()
}

async function validateApiDate(req, res, next) 
{
    const { date } = req.body;

    if (!date) return Redirects_SR.Api.sendApi(res, [])

    next()
}

async function validateRegUser(req, res, next) 
{
    const { username, email } = req.body;
    const userSchema = Joi.object({
        username: Joi.string().required(),
        email: Joi.string().required()
    })

    const { error } = userSchema.validate({ username, email })

    if (error) 
    {
        console.log(error)
        const msg = error.details.map(e => e.message).join(',')
        return new userError(msg, 401).throw_CS(res)
    }

    const bodyError = inspectUser(username, email)

    if (bodyError) 
    {
        return new userError(bodyError, 401).throw_CS(res)
    }

    req.body.username = username.trim()
    req.body.email = email.trim()

    next()

}

async function validateLogUser(req, res, next) 
{
    const { username, password, remember } = req.body;

    const userSchema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
        remember: Joi.boolean().required()
    })

    const { error } = userSchema.validate({ username, password, remember })

    if (error) 
    {
        console.log(error)
        const msg = error.details.map(e => e.message).join(',')
        return new userError(msg, 401).throw_CS(res)
    }

    const bodyError = inspectUser(username, undefined, password)

    if (bodyError) 
    {
        return new userError(bodyError, 401).throw_CS(res)
    }

    req.body.username = username.trim()
    req.body.password = password.trim()

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

function verifyPendingUser(req, res, next) 
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

function verifyTokenUser(req, res, next) 
{
    Token.findOne({
        token: req.params.confirmationCode,
    })
        .then(async (token) =>
        {
            if (!token)
            {
                new userError(...Object.values(errorMessages.tokenExpired)).throw_SR(req, res)
            }
            next()
        })
        .catch((err) => 
        {
            console.log(err)
            new userError(err.message, err.status).throw_SR(req, res)
        });
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

async function getUsername(req, res)
{
    return await User.findOne({ username: req.session.passport.user }, {username: 1, email: 1, status: 1, date: 1})
}

// async function checkUser(req, res)
// {
//     if(req.body.u)
// }


module.exports = {
    validateDeclr: validateDeclr, validateRegUser,
    validateLogUser, isLogged_SR,
    isLogged_CS, tryAsync_CS, tryAsync_SR,
    apiSecret, verifyPendingUser, isAdmin_SR,
    isAdmin_CS, hasDeclrs, validateApiQuery,
    validateApiDate, validateComment, checkCommentUser,
    getUsername, verifyTokenUser
}