const router = require('express').Router();
const { app } = require("../main");
const Redirects_SR = require('../utilsSR/general/SR_Redirects');
const Pending = require("../models/pending")
const Declaration = require("../models/declaration")
const User = require("../models/user")
const Token = require("../models/token")
const { tryAsync_CS, apiSecret, tryAsync_SR, } = require('../utilsSR/middlewares/_m_basic')
const { isLogged_SR, isLogged_CS, isSameUser, isAdmin_CS } = require('../utilsSR/middlewares/_m_user')
const { verifyPendingCode, verifyResetToken, } = require('../utilsSR/middlewares/_m_verify')
const { validatePendingUser, validateLogUser, validateRegUser, validateChange } = require('../utilsSR/middlewares/_m_validations')
const { getUserdata } = require('../utilsSR/primary/_p_user')

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

router.get('/change', isLogged_SR, tryAsync_SR(async (req, res) =>
{
    const user = await getUserdata(req, res)
    app.render(req, res, "/user/change", { user })
}))

router.get("/pending/:confirmationCode", verifyPendingCode, tryAsync_SR(async (req, res) =>
{
    const confirmationCode = req.params.confirmationCode
    app.render(req, res, "/welcome", { confirmationCode })
}))

router.get('/reset/:confirmationCode', verifyResetToken, tryAsync_SR(async (req, res) =>
{
    const confirmationCode = req.params.confirmationCode
    app.render(req, res, "/reset", { confirmationCode })
}))

router.post('/all/api', apiSecret, isLogged_CS, isAdmin_CS, tryAsync_CS(async (req, res) =>
{
    const users = User.getSecured(await User.find({}))
    Redirects_SR.Api.sendApi(res, users)
}))

router.post('/one/api', apiSecret, isLogged_CS, tryAsync_CS(async (req, res) =>
{
    const user = await getUserdata(req, res)
    Redirects_SR.Api.sendApi(res, user)
}))

router.post('/pending', validatePendingUser, tryAsync_CS(async (req, res) =>
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

router.post("/register", validateRegUser, tryAsync_SR(async (req, res) =>
{
    const { confirmationCode, password } = req.body

    console.log("2")
    const pending = await Pending.findOne({ confirmationCode })

    console.log("3")
    await User.processRegister(req, res, { pending, password })
    await Pending.findByIdAndDelete(pending._id)
    req.flash('success', 'Successfuly Registered');
    Redirects_SR.Home.CS(res)
}))

router.post('/reset/send', isLogged_CS, tryAsync_CS(async (req, res) =>
{
    const user = await getUserdata(req, res)
    const token = new Token({ user })
    await token.processReset(req, res)
    await token.save()
    req.flash('success', 'Check your email')
    Redirects_SR.Home.CS(res)
}))

router.post('/reset', verifyResetToken, tryAsync_CS(async (req, res) =>
{
    const { confirmationCode, password } = req.body
    const token = await Token.findOne({ token: confirmationCode }).populate('user')
    await Token.deleteOne({ token: confirmationCode })
    await token.resetPassword(req, res, confirmationCode, { user: token.user, password })
    req.flash('success', 'Password reseted!')
    Redirects_SR.Home.CS(res)
}))

router.post('/reset/exists', apiSecret, tryAsync_CS(async (req, res) =>
{
    const { id } = req.body;
    const token = await Token.findOne({ user: id });
    Redirects_SR.Api.sendApi(res, token ? true : false)
}))

router.post('/change', isLogged_CS, validateChange, tryAsync_CS(async (req, res, next) =>
{
    const userdata = await getUserdata(req, res)
    const user = await User.findOne({ _id: userdata._id });
    const Obj = await User.updateChanges(req, res, user);
    await User.findByIdAndUpdate(user._id , Obj)
    req.session.passport.user = Obj.username
    req.flash('success', 'Changed Account Details');
    Redirects_SR.Home.CS(res)
}))

router.post('/bookmark', apiSecret, isLogged_CS, tryAsync_CS(async (req, res) => 
{
    const { id } = req.body;
    const userdata = await getUserdata(req, res)
    const user = await User.findOne({ _id: userdata._id });
    const declaration = await Declaration.findOne({ _id: id, status: "Active" });
    user.tryBoookmark(declaration)
    await user.save()
    Redirects_SR.Api.sendApi(res, true)
}))

router.post('/:id/bookmarks/api', apiSecret, isLogged_CS, tryAsync_CS(async (req, res) =>
{
    const { bookmarks } = req.body;
    const userdata = await getUserdata(req, res)
    const user = await User.findOne({ _id: userdata._id }).populate({
        path: 'bookmarks',
        options: {
            limit: process.env.COMMENTS_LOAD_LIMIT,
            sort: { _id: -1 },
            skip: bookmarks.length,
        }
    })
    Redirects_SR.Api.sendApi(res, user.bookmarks)
}))

router.post('/theme', apiSecret, tryAsync_CS(async (req, res) =>
{
    const { light } = req.body;
    req.session.light = !light
    Redirects_SR.Api.sendApi(res, !light)
}))

module.exports = router;