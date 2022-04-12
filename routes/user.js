const router = require('express').Router();
const { app } = require("../main");
const { validateDbData, StorageUpload, tryAsync, tryRegister, tryLogin, isLoggedin, validateAuthData, rememberMe } = require('../utils/serverFunc');
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
    const remember = JSON.parse(req.body.remember)
    tryLogin(req, res, next, async () =>
    {
        if (remember)
        {
            req.session.cookie.expires = false
        } 
        else
        {
            req.session.cookie.originalMaxAge = 24 * 60 * 60 * 1000 // Expires in 1 day
        }
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