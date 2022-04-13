const Redirects = require('./ResRedirect');
const Joi = require("joi");
const ServerError = require('./ServerError');
const passport = require('passport');
const User = require("../models/user");
const {validateBody, validateUser, modifyDesc} = require('./secFunc')


async function validateDbData(req, res, next) 
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
        date: Joi.string().required()
    })

    const preparedBody =
    {
        title, description: JSON.parse(description), file, date
    }

    const { error } = declarationSchema.validate(preparedBody)

    if (error) 
    {
        console.log(error)
        const msg = error.details.map(e => e.message).join(',')
        return Redirects.Api.send(res, { err: { message: msg } })
        // next(new ServerError(msg, 400))
    }

    newFile = req.files ? req.files.file : undefined;

    const bodyError = validateBody(title, JSON.parse(description), newFile, date)

    if (bodyError) 
    {
        return Redirects.Api.send(res, { err: { message: bodyError } })
        // next(new ServerError(bodyError, 400))
    }
    req.body.title = title.trim()
    req.body.description = JSON.stringify(modifyDesc(JSON.parse(description)))
    next()

}


async function validateAuthData(req, res, next) 
{
    const { username, password } = req.body;

    const userSchema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required()
    })

    const { error } = userSchema.validate({ username, password })

    if (error) 
    {
        console.log(error)
        const msg = error.details.map(e => e.message).join(',')
        return Redirects.Api.send(res, { err: { message: msg } })
        // next(new ServerError(msg, 400))
    }

    const bodyError = validateUser(username, password)

    if (bodyError) 
    {
        return Redirects.Api.send(res, { err: { message: bodyError } })
        // next(new ServerError(bodyError, 400))
    }
    req.body.username = username.trim()
    req.body.password = password.trim()
    next()

}


function isLoggedin(req, res, next)
{
    if (!req.isAuthenticated())
    {
        Redirects.Auth.serverRes(res)
    }
    else
    {
        next()
    }
}

function isClientLoggedin(req, res, next)
{
    if (!req.isAuthenticated())
    {
        Redirects.Auth.sendRes(res)
    }
    else
    {
        next()
    }
}

function tryAsync(func)
{
    return function (req, res, next)
    {
        func(req, res, next).catch(e => next(e))
    }
}

function ValidateSecret(key, callback)
{
    if (key === process.env.NEXT_PUBLIC_SECRET)
    {
        callback()
    }
    else
    {
        throw new ServerError("UnAuthorized", 401)
    }
}

async function tryRegister(req, res, func)
{
    try
    {
        const { username, password } = req.body;
        const user = new User({ username })
        await User.register(user, password)
        func()
    }
    catch (err)
    {
        Redirects.Api.send(res, { err })
    }
}

async function tryLogin(req, res, next, func)
{
    passport.authenticate('local', function (err, user, info)
    {
        if (err)
        {
            Redirects.Api.send(res, { err })
        }
        else if (!user) 
        {
            Redirects.Api.send(res, { err: { message: info.message } })
        }
        else
        {
            const remember = JSON.parse(req.body.remember)
            req.login(user, function (error)
            {
                if (error) res.json({ error });
            });
            if (remember)
            {
                req.session.cookie.expires = false
            }
            else
            {
                req.session.cookie.originalMaxAge = 24 * 60 * 60 * 1000 // Expires in 1 day
            }
            func()
        }
    })(req, res, next);
}


module.exports = { validateDbData, validateAuthData, isLoggedin, isClientLoggedin, tryAsync, ValidateSecret, tryRegister, tryLogin }