const router = require('express').Router();
const { app } = require("../main");
const Redirects = require('../utils/Redirects');
const { validateRegUser, validateLogUser, isLogged_CS, tryAsync_CS, tryAsync_SR, doRegister, doLogin, verifyUser } = require('../utils/_primary')

router.get('/register', async (req, res) =>
{
    app.render(req, res, "/user/register")
})

router.get('/login', async (req, res) =>
{
    app.render(req, res, "/user/login")
})

router.post('/register', validateRegUser, tryAsync_CS(async (req, res) =>
{
    doRegister(req, res, async () =>
    {
        req.flash('success', 'Successfuly Registered');
        Redirects.Home.CS(res)
    })
}))

router.post('/login', validateLogUser, tryAsync_CS(async (req, res, next) =>
{
    doLogin(req, res, next, async () =>
    {
        req.flash('success', 'Welcome Back');
        Redirects.Home.CS(res)
    })
}))

router.post('/logout', isLogged_CS, tryAsync_CS(async (req, res) =>
{
    req.logout()
    req.flash('info', 'Logged Out');
    Redirects.Home.CS(res)
}))

router.get("/confirm/:confirmationCode", verifyUser, tryAsync_SR(async (req, res) =>
{
    const confirmationCode = req.params.confirmationCode
    app.render(req, res, "/welcome", { confirmationCode })
}))

module.exports = router;