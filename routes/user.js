const router = require('express').Router();
const { app } = require("../main");
const Redirects = require('../utils/ResRedirect');
const { validateAuthData, isLoggedin,  tryAsync,tryRegister, tryLogin } = require('../utils/primFunc')

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
    tryRegister(req, res, async () =>
    {
        req.flash('success', 'Successfuly Registered');
        Redirects.Client.sendRes(res)
    })
}))

router.post('/login', validateAuthData, tryAsync(async (req, res, next) =>
{
    tryLogin(req, res, next, async () =>
    {
        req.flash('success', 'Welcome Back');
        Redirects.Client.sendRes(res)
    })
}))

router.post('/logout', isLoggedin, tryAsync(async (req, res, next) =>
{
    req.logout()
    req.flash('info', 'Logged Out');
    Redirects.Client.sendRes(res)
}))
module.exports = router;