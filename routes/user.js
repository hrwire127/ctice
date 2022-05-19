const router = require('express').Router();
const { app } = require("../main");
const { Redirects_SR } = require('../utilsSR/SR_Redirects');
const Pending = require("../models/pending")
const User = require("../models/user")
const Token = require("../models/token")
const { validateRegUser, validateLogUser, isLogged_CS,
    isLogged_SR, tryAsync_CS, tryAsync_SR, verifyPending,
    apiSecret, getUserdata, verifyTokenReset, isSessionUser,
    verifyConfirmCode, validateChange, validatePending } = require('../utilsSR/_middlewares')

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
    const user = await getUserdata(req, res)
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
    const user = await getUserdata(req, res)
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

router.get("/confirm/:confirmationCode", verifyPending, tryAsync_SR(async (req, res) =>
{
    const confirmationCode = req.params.confirmationCode
    app.render(req, res, "/welcome", { confirmationCode })
}))

router.post("/confirm", validatePending, tryAsync_SR(async (req, res) =>
{
    const { confirmationCode, password } = req.body
    const pending = await Pending.findOne({ confirmationCode })
    const user = new User({ //copy user static
        username: pending.username,
        date: [pending.date],
        email: pending.email,
        status: "Active"
    })

    await User.processRegister(req, res, pending, { user, password })
    await Pending.findByIdAndDelete(pending._id)
    req.flash('success', 'Successfuly Registered');
    Redirects_SR.Home.CS(res)
}))

//forgot password page + email

router.post('/reset/pending', isSessionUser, tryAsync_CS(async (req, res) =>
{
    const user = await getUserdata(req, res)
    const token = new Token({ user })
    await token.processReset(req, res)
    await token.save()
    req.flash('success', 'Check your email')
    Redirects_SR.Home.CS(res)
}))

router.get('/reset/:confirmationCode', verifyTokenReset, tryAsync_CS(async (req, res) =>
{
    const confirmationCode = req.params.confirmationCode
    app.render(req, res, "/reset", { confirmationCode })
}))

router.post('/reset', verifyConfirmCode, tryAsync_CS(async (req, res) =>
{
    const { confirmationCode, password } = req.body
    const token = await Token.findOne({ token: confirmationCode }).populate('user')
    await Token.deleteOne({ token: confirmationCode })
    await token.reset(req, res, confirmationCode, { user: token.user, password })
    req.flash('success', 'Password reseted!')
    Redirects_SR.Home.CS(res)
}))

router.get('/change', isLogged_SR, tryAsync_CS(async (req, res) =>
{
    const user = await getUserdata(req, res)
    app.render(req, res, "/user/change", { user })
}))

router.post('/change', isLogged_CS, isSessionUser, validateChange, tryAsync_CS(async (req, res, next) =>
{
    const { id } = req.body;
    const user = await User.findById(id);
    await user.updateChanges(req, res);
    await user.save()
    req.flash('success', 'Changed Account Details');
    Redirects_SR.Home.CS(res)
}))

router.post('/theme', apiSecret, tryAsync_CS(async (req, res) =>
{
    const { light } = req.body;
    req.session.light = !light
    Redirects_SR.Api.sendApi(res, !light)
}))

router.post('/reset/token/exists', apiSecret, tryAsync_CS(async (req, res) =>
{
    const { id } = req.body;
    const token = await Token.findOne({ user: id });
    Redirects_SR.Api.sendApi(res, token ? true : false)
}))

module.exports = router;