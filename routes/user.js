const router = require('express').Router();
const { app } = require("../main");
const Redirects = require('../utils/Redirects');
const { validateRegUser, validateLogUser, isLogged_CS, tryAsync_CS, tryAsync_SR, verifyUser } = require('../utils/_middlewares')
const { doPending, doLogin, doRegister, sendEmail } = require('../utils/_primary')

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
    const { username, email, date } = req.body;
    const pending = await doPending(username, email, date, res)
    await sendEmail(pending)
    await pending.save()
    req.flash('info', 'Checkout your email, pending exires in 5 min');
    Redirects.Home.CS(res)
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

router.post("/confirm", tryAsync_SR(async (req, res) =>
{
    const { confirmationCode, password } = req.body
    await doRegister(confirmationCode, password, res)
    req.flash('success', 'Successfuly Registered');
    Redirects.Home.CS(res)
}))

module.exports = router;