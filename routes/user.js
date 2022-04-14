const router = require('express').Router();
const { app } = require("../main");
const Redirects = require('../utils/Redirects');
const { validateRegisterData, validateLoginData, isClientLoggedin, tryClientAsync, tryServerAsync, tryRegister, tryLogin, verifyUser } = require('../utils/_primary')

router.get('/register', async (req, res, next) =>
{
    app.render(req, res, "/user/register")
})

router.get('/login', async (req, res, next) =>
{
    app.render(req, res, "/user/login")
})

router.post('/register', validateRegisterData, tryClientAsync(async (req, res, next) =>
{
    tryRegister(req, res, async () =>
    {
        req.flash('success', 'Successfuly Registered');
        Redirects.Client.sendRes(res)
    })
}))

router.post('/login', validateLoginData, tryClientAsync(async (req, res, next) =>
{
    tryLogin(req, res, next, async () =>
    {
        req.flash('success', 'Welcome Back');
        Redirects.Client.sendRes(res)
    })
}))

router.post('/logout', isClientLoggedin, tryClientAsync(async (req, res, next) =>
{
    req.logout()
    req.flash('info', 'Logged Out');
    Redirects.Client.sendRes(res)
}))

router.get("/confirm/:confirmationCode", verifyUser, tryServerAsync(async (req, res, next) =>
{
    app.render(req, res, "/welcome")
}))

module.exports = router;