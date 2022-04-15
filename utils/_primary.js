const Redirects = require('./Redirects');
const Joi = require("joi");
const userError = require('./userError');
const passport = require('passport');
const User = require("../models/user");
const nodemailer = require('../config/nodemailer')
const { inspectDecrl, inspectUser, modifyDesc, genToken } = require('./_secondary')

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
        // return Redirects.Api.sendObj(res, { err: { message: msg } })
        return new userError(msg, 401).throw_CS() //stop
        // next(new userError(msg, 400))
    }

    newFile = req.files ? req.files.file : undefined;

    const bodyError = inspectDecrl(title, JSON.parse(description), newFile, date)

    if (bodyError) 
    {
        return new userError(bodyError, 401).throw_CS()
        // return Redirects.Api.sendObj(res, { err: { message: bodyError } })
        // next(new userError(bodyError, 400))
    }

    req.body.title = title.trim()
    req.body.description = JSON.stringify(modifyDesc(JSON.parse(description)))
    next()
}


async function validateRegUser(req, res, next) 
{
    const { username, password, email } = req.body;

    const userSchema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
        email: Joi.string().required()
    })

    const { error } = userSchema.validate({ username, password, email })

    if (error) 
    {
        console.log(error)
        const msg = error.details.map(e => e.message).join(',')
        return new userError(msg, 401).throw_CS()
        // return Redirects.Api.sendObj(res, { err: { message: msg } })
        // next(new userError(msg, 400))
    }

    const bodyError = inspectUser(username, password, email)

    if (bodyError) 
    {
        return new userError(bodyError, 401).throw_CS()
        // return Redirects.Api.sendObj(res, { err: { message: bodyError } })
        // next(new userError(bodyError, 400))
    }
    req.body.username = username.trim()
    req.body.password = password.trim()
    req.body.email = email.trim()
    next()

}

async function validateLogUser(req, res, next) 
{
    const { username, password } = req.body;

    const userSchema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
    })

    const { error } = userSchema.validate({ username, password })

    if (error) 
    {
        console.log(error)
        const msg = error.details.map(e => e.message).join(',')
        return new userError(msg, 401).throw_CS()
        // return Redirects.Api.sendObj(res, { err: { message: msg } })
        // next(new userError(msg, 400))
    }

    const bodyError = inspectUser(username, password)

    if (bodyError) 
    {
        return new userError(bodyError, 401).throw_CS()
        // return Redirects.Api.sendObj(res, { err: { message: bodyError } })
        // next(new userError(bodyError, 400))
    }
    req.body.username = username.trim()
    req.body.password = password.trim()
    next()

}


function isLogged_SR(req, res, next)
{
    if (!req.isAuthenticated())
    {
        Redirects.Login.SR(res)
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
        Redirects.Login.CS(res)
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
        next(new userError("UnAuthorized", 401))
    }
    next()
}

async function doRegister(req, res, func)
{
    try
    {
        const { username, password, email } = req.body;
        const token = genToken()
        const user = new User({
            username,
            status: "Disabled",
            email: email,
            confirmationCode: token
        })
        nodemailer.sendConfirmationEmail(
            user.username,
            user.email,
            user.confirmationCode).then(async res =>
            {
                await User.register(user, password)
            })
        func()
    }
    catch (err)
    {
        new userError("Did not work").throw_CS(res)
        // Redirects.Error.CS(res)
    }
}

async function doLogin(req, res, next, func)
{
    passport.authenticate('local', function (err, user, info)
    {
        if (err)
        {
            new userError(err.message, err.status).throw_CS();
        }
        else if (!user) 
        {
            new userError(info.message, 400).throw_CS();
        }
        else
        {
            if (user.status !== "Active")
            {
                new userError("Pending Account. Please Verify Your Email!", 401).throw_CS();
                // Redirects.Api.sendObj(res, { err: { message: "Pending Account. Please Verify Your Email!" } })
            }
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

function verifyUser(req, res, next) 
{
    User.findOne({
        confirmationCode: req.params.confirmationCode,
    })
        .then((user) =>
        {
            if (!user)
            {
                new userError("User Not found.", 404).throw_SR(req, res)
            }

            if (user.status === "Disabled")
            {
                user.status = "Active";
                user.save();
                next()
            }
            else
            {
                new userError("User Allready Confirmed", 403).throw_SR(req, res)
            }
        })
        .catch((e) => console.log("error", e));
};

module.exports = {
    validateDeclr: validateDeclr, validateRegUser,
    validateLogUser, isLogged_SR: isLogged_SR,
    isLogged_CS, tryAsync_CS, tryAsync_SR,
    apiSecret, doRegister, doLogin,
    verifyUser
}