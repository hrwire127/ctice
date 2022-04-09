const router = require('express').Router();
const { app } = require("../main");
const { validateDbData, StorageUpload, tryAsync, ValidateSecret, processData } = require('../utils/serverFunc');
const User = require("../models/user");
const passport = require('passport');
const ServerError = require('../utils/ServerError');

router.get('/register', tryAsync(async (req, res, next) =>
{
    app.render(req, res, "/user/register")
}))

router.get('/login', tryAsync(async (req, res, next) =>
{
    app.render(req, res, "/user/login")
}))

router.post('/register', tryAsync(async (req, res, next) =>
{
    const { username, password } = req.body;
    try
    {
        const user = new User({ username })
        const registeredUser = await User.register(user, password)
        req.session.flash = "Welcome";
        res.json({ confirm: "Success", redirect: '/' });
    }
    catch (err)
    {
        res.json({ err })
    }
}))

router.post('/login', tryAsync(async (req, res, next) =>
{
    passport.authenticate('local', function (err, user, info)
    {
        console.log(err)
        console.log(user)
        console.log(info)
        if (err)
        {
            res.json({ err })
        }
        else if (!user) 
        {
            res.json({ err: { message: info.message } })
        }
        else
        {
            req.login(user, function (error)
            {
                if (error) res.json({ error });
            });
            req.flash('success', 'Welcome');
            res.json({ confirm: "Success", redirect: '/' });

        }
    })(req, res, next);
}))

module.exports = router;