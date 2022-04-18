const router = require('express').Router();
const { app } = require("../main");
<<<<<<< HEAD
const Redirects = require('../utilsSR/Redirects');
const { validateRegUser, validateLogUser, isLogged_CS, tryAsync_CS, tryAsync_SR, verifyUser } = require('../utilsSR/_middlewares')
const { doPending, doLogin, doRegister } = require('../utilsSR/_primary')
=======
const Redirects = require('../utils/Redirects');
const { validateRegUser, validateLogUser, isLogged_CS, tryAsync_CS, tryAsync_SR, verifyUser } = require('../utils/_middlewares')
const { doPending, doLogin, doRegister, sendEmail } = require('../utils/_primary')
>>>>>>> 3a6d6164f1a207ed8e5c2b711b029497d99e147b

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
<<<<<<< HEAD
    return doPending(req, res, async () =>
    {
        req.flash('info', 'Checkout your email, pending exires in 5 min');
        Redirects.Home.CS(res)
    })
=======
    const { username, email, date } = req.body;
    const pending = await doPending(username, email, date, res)
    await sendEmail(pending)
    await pending.save()
    req.flash('info', 'Checkout your email, pending exires in 5 min');
    Redirects.Home.CS(res)
>>>>>>> 3a6d6164f1a207ed8e5c2b711b029497d99e147b
}))

router.post('/login', validateLogUser, tryAsync_CS(async (req, res, next) =>
{
    return doLogin(req, res, next, async () =>
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
<<<<<<< HEAD
    return doRegister(req, res, () =>
    {
        req.flash('success', 'Successfuly Registered');
        Redirects.Home.CS(res)
    })
=======
    const { confirmationCode, password } = req.body
    await doRegister(confirmationCode, password, res)
    req.flash('success', 'Successfuly Registered');
    Redirects.Home.CS(res)
>>>>>>> 3a6d6164f1a207ed8e5c2b711b029497d99e147b
}))

module.exports = router;