const router = require('express').Router();
const { app } = require("../main");
const { Redirects_SR } = require('../utilsSR/SR_Redirects');
const Pending = require("../models/pending")
const User = require("../models/user")
const Token = require("../models/token")
const { validateRegUser, validateLogUser, isLogged_CS,
    isLogged_SR, tryAsync_CS, tryAsync_SR, verifyPendingUser,
    apiSecret, getUsername, verifyTokenUser, verifyUser,
    verifyConfirmCode, verifyPendingCode, validateUser } = require('../utilsSR/_middlewares')

router.get('/register', async (req, res) =>
{
    app.render(req, res, "/user/register")
})

router.get('/login', async (req, res) =>
{
    app.render(req, res, "/user/login")
})

router.get('/profile', isLogged_SR, async (req, res) =>
{
    const user = await getUsername(req, res)
    app.render(req, res, "/user/profile", { user })
})

router.post('/all/api', apiSecret, tryAsync_CS(async (req, res) =>
{
    const users = await User.find({});
    const securedUsers = User.getSecured(users)
    Redirects_SR.Api.sendApi(res, securedUsers)
}))

router.post('/one/api', apiSecret, isLogged_CS, tryAsync_CS(async (req, res) =>
{
    const user = await getUsername(req, res)
    Redirects_SR.Api.sendApi(res, user)
}))

router.post('/register', validateRegUser, tryAsync_CS(async (req, res) =>
{
    const pending = new Pending(req.body)
    await pending.processPending(req, res)
    await pending.save()
    req.flash('info', 'Checkout your email, pending exires in 5 min');
    Redirects_SR.Home.CS(res)
}))

router.post('/login', validateLogUser, tryAsync_CS(async (req, res, next) =>
{
    await User.processLogin(req, res, next);
    req.flash('success', 'Welcome Back');
    Redirects_SR.Home.CS(res)

}))

router.post('/logout', isLogged_CS, tryAsync_CS(async (req, res) =>
{
    req.logout()
    req.flash('info', 'Logged Out');
    Redirects_SR.Home.CS(res)
}))

router.get("/confirm/:confirmationCode", verifyPendingUser, tryAsync_SR(async (req, res) =>
{
    const confirmationCode = req.params.confirmationCode
    app.render(req, res, "/welcome", { confirmationCode })
}))

router.post("/confirm", validateUser, tryAsync_SR(async (req, res) =>
{
    const { confirmationCode, password } = req.body
    const { profile } = req.files;
    const pending = await Pending.findOne({ confirmationCode })
    const user = new User({
        username: pending.username,
        date: pending.date,
        email: pending.email,
        status: "Active"
    })

    const credentials = { user, password }
    await User.processRegister(req, res, pending, credentials)
    console.log("!!!!")
    await Pending.findByIdAndDelete(pending._id)
    console.log("!!!!")
    req.flash('success', 'Successfuly Registered');
    Redirects_SR.Home.CS(res)
}))

//forgot password page + email
router.get('/reset/:confirmationCode', verifyTokenUser, tryAsync_CS(async (req, res) =>
{
    const confirmationCode = req.params.confirmationCode
    app.render(req, res, "/reset", { confirmationCode })
}))

router.post('/reset/pending', verifyUser, tryAsync_CS(async (req, res) =>
{
    const user = await getUsername(req, res);
    const token = new Token({ user })
    await token.processPending(req, res)
    await token.save()
    req.flash('success', 'Check your email');
    Redirects_SR.Home.CS(res)
}))

router.post('/reset', verifyConfirmCode, tryAsync_CS(async (req, res) =>
{
    const { confirmationCode, password } = req.body;
    const token = await Token.findOne({ token: confirmationCode }).populate('user');
    await Token.deleteOne({ token: confirmationCode });
    await token.processReset(req, res, confirmationCode, { user: token.user, password })
    req.flash('success', 'Password reseted!');
    Redirects_SR.Home.CS(res)
}))

router.post('/theme', apiSecret, tryAsync_CS(async (req, res) =>
{
    const { light } = req.body;
    req.session.light = !light
    Redirects_SR.Api.sendApi(res, !light)
}))

module.exports = router;