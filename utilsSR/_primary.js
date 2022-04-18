const { excRule } = require('./exc-Rule');
const userError = require('./userError');
const { cloud } = require('../cloud/storage');
const Redirects = require('./Redirects');
const passport = require('passport');
const User = require("../models/user");
const Pending = require("../models/pending")
const nodemailer = require('../config/nodemailer')
const errorMessages = require("./errorMessages")
const { genToken } = require('./_secondary')
const { upload } = require('./_tertiary')


async function ProcessDeclr(body = undefined, files = undefined, declaration = undefined, del = false)
{
    const hadFile = declaration ? declaration['file']['url'] !== undefined : undefined;

    let Obj = {
        ...body
    }

    if (del)
    {
        await new excRule([], [], async () =>
        {
            if (declaration.file.location)
            {
                await cloud.destroy(
                    declaration.file.location,
                )
            }
        }, true).Try();
        return;
    }


    Obj.date = declaration ? declaration.date : []
    Obj.date.push(body.date)

    let q = await new excRule([body.file, files, hadFile], [], async () =>
    {
        let file = await upload(files.file)
        await cloud.destroy(
            declaration.file.location,
        )
        Obj.file = {
            name: files.file.name,
            url: file.url,
            location: file.location
        }
    }).Try();
    if (q) return Obj;

    let w = await new excRule([body.file, files], [hadFile], async () =>
    {
        let file = await upload(files.file)
        Obj.file = {
            name: files.file.name,
            url: file.url,
            location: file.location
        }
    }).Try();
    if (w) return Obj;

    let e = await new excRule([], [body.file, files, hadFile], async () =>
    { }).Try();
    if (e) return Obj;

    let r = await new excRule([hadFile], [body.file, files,], async () =>
    {
        await cloud.destroy(
            declaration.file.location,
        )
        declaration.file = undefined
        await declaration.save();
    }).Try();
    if (r) return Obj;

    let t = await new excRule([body.file, hadFile], [files], async () =>
    {
        Obj.file = declaration.file;
    }).Try()
    if (t) return Obj;

}

async function doLogin(req, res, next, func)
{
    passport.authenticate('local', function (err, user, info)
    {
        if (err)
        {
            new userError(err.message, err.status).throw_CS(res);
        }
        else if (!user) 
        {
            new userError(info.message, 404).throw_CS(res);
        }
        else
        {
            if (user.status !== "Active")
            {
                new userError(...Object.values(errorMessages.disabledUser)).throw_CS(res);
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
        Redirects.Error.CS(res)
    }
}

async function doPending(req, res, func)
{
    const { username, email, date } = req.body;

    const token = genToken()
    const pending = new Pending({
        username,
        email,
        date,
        confirmationCode: token
    })
    if (await Pending.findOne({ email }) || await User.findOne({ email }))
    {
        new userError(...Object.values(errorMessages.emailAllreadyUsed)).throw_CS(res)
    }
    else if (await Pending.findOne({ username }) || await User.findOne({ username }))
    {
        new userError(...Object.values(errorMessages.usernameAllreadyUsed)).throw_CS(res)
    }
    else
    {
        nodemailer.sendConfirmationEmail(
            pending.username,
            pending.email,
            pending.confirmationCode
        ).then(async () =>
        {
            await pending.save()
            func()
        })
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
    doPending, doLogin, doRegister, ProcessDeclr, sendEmail
}