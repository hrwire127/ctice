const router = require('express').Router();
const { app } = require("../main");
const { validateDbData, StorageUpload, tryAsync, tryRegister, tryLogin, isLoggedin, validateAuthData } = require('../utils/serverFunc');
const User = require("../models/user");
const Redirects = require('../utils/ResRedirect');

router.get('/register', async (req, res, next) =>
{
    app.render(req, res, "/user/register")
})

router.get('/login', async (req, res, next) =>
{
    app.render(req, res, "/user/login")
})

router.post('/register', validateAuthData, tryAsync(async (req, res, next) =>
{
    const { username, password } = req.body;

    tryRegister(req, res, async () =>
    {
        const user = new User({ username })
        const registeredUser = await User.register(user, password)
        req.flash('success', 'Registered');
        Redirects.Client.sendRes(res)
    })
}))

router.post('/login', validateAuthData, tryAsync(async (req, res, next) =>
{
    tryLogin(req, res, next, async (user) =>
    {
        req.login(user, function (error)
        {
            if (error) res.json({ error });
        });
        req.flash('success', 'Welcome Back');
        Redirects.Client.sendRes(res)
    })
}))

router.post('/logout', isLoggedin, tryAsync(async (req, res, next) =>
{
    req.logout()
    req.flash('success', 'Logged Out');
    Redirects.Client.sendRes(res)
}))
module.exports = router;