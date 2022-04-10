const router = require('express').Router();
const { app } = require("../main");
const { validateDbData, StorageUpload, tryAsync, tryRegister, tryLogin, isLoggedin } = require('../utils/serverFunc');
const User = require("../models/user");
const ServerError = require('../utils/ServerError');

router.get('/register', async (req, res, next) =>
{
    app.render(req, res, "/user/register")
})

router.get('/login', async (req, res, next) =>
{
    app.render(req, res, "/user/login")
})

router.post('/register', tryAsync(async (req, res, next) =>
{
    const { username, password } = req.body;

    tryRegister(async () =>
    {
        const user = new User({ username })
        const registeredUser = await User.register(user, password)
        req.flash('success', 'Registered');
        res.json({ confirm: "Success", redirect: '/' });
    })
}))

router.post('/login', tryAsync(async (req, res, next) =>
{
    tryLogin(req, res, next, async (user) =>
    {
        req.login(user, function (error)
        {
            if (error) res.json({ error });
        });
        req.flash('success', 'Welcome Back');
        res.json({ confirm: "Success", redirect: '/' });
    })
}))

router.post('/logout', isLoggedin, tryAsync(async (req, res, next) =>
{
    req.logout()
    res.json({ confirm: "Success", redirect: '/' });
}))
module.exports = router;