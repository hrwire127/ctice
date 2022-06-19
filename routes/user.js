const router = require('express').Router();
const { app } = require("../main");
const UserError = require('../utilsSR/general/userError')
const Redirects_SR = require('../utilsSR/general/SR_Redirects');
const Pending = require("../models/pending")
const Declaration = require("../models/declaration")
const Banner = require('../models/banner')
const User = require("../models/user")
const Token = require("../models/token")
const mongoose = require('mongoose')
const { tryAsync_CS, apiSecret, tryAsync_SR } = require('../utilsSR/middlewares/_m_basic')
const { isLogged_SR, isLogged_CS, isSameUser, isAdmin_CS } = require('../utilsSR/middlewares/_m_user')
const { verifyPendingCode, verifyResetToken, } = require('../utilsSR/middlewares/_m_verify')
const { validatePendingUser, validateLogUser, validateRegUser, validateChange, validateGallery } = require('../utilsSR/middlewares/_m_validations')
const { getUserdata } = require('../utilsSR/primary/_p_user')

router.get('/register', (req, res) =>
{
    app.render(req, res, "/user/register")
})

router.get('/login', (req, res) =>
{
    app.render(req, res, "/user/login")
})

router.get('/profile', isLogged_SR, tryAsync_SR(async (req, res) =>
{
    const user = await getUserdata(req, res)
    app.render(req, res, "/user/profile", { user })
}))

router.get('/profile/edit', isLogged_SR, tryAsync_SR(async (req, res) =>
{
    const user = await getUserdata(req, res)
    app.render(req, res, "/user/profile/edit", { user })
}))

router.get('/profile/customs', isLogged_SR, tryAsync_SR(async (req, res) =>
{
    const user = await getUserdata(req, res)
    app.render(req, res, "/user/profile/customs", { user })
}))

router.get('/profile/bookmarks', isLogged_SR, tryAsync_SR(async (req, res) =>
{
    const user = await getUserdata(req, res)
    app.render(req, res, "/user/profile/bookmarks", { user })
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

router.post('/all/api', apiSecret, isAdmin_CS, tryAsync_CS(async (req, res) =>
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

router.post("/register", validateRegUser, tryAsync_CS(async (req, res) =>
{
    const { confirmationCode, password } = req.body

    const pending = await Pending.findOne({ confirmationCode })

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
    await User.findByIdAndUpdate(user._id, Obj)
    req.session.passport.user = Obj.username
    req.flash('success', 'Changed Account Details!');
    Redirects_SR.Api.sendApi(res, req.session.flash[0])
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
    const { bookmarks, doclimit, tags } = req.body;

    console.log(tags)
    const userdata = await getUserdata(req, res)
    const user = await User.findOne({ _id: userdata._id })
        .populate({
            path: 'bookmarks',
            options:
                tags.length > 0
                    ? {
                        tags: { $in: tags.map(t => mongoose.Types.ObjectId(t._id)) },
                        limit: doclimit,
                        sort: { _id: -1 },
                        skip: bookmarks.length,
                    }
                    : {
                        limit: doclimit,
                        sort: { _id: -1 },
                        skip: bookmarks.length,
                    }
        })
    Redirects_SR.Api.sendApi(res, user.bookmarks)
}))

router.post('/:id/bookmarks/load/api', apiSecret, isLogged_CS, tryAsync_CS(async (req, res) =>
{
    const { bookmarks, query, doclimit, tags } = req.body;

    const obj = {
        tags: tags.length > 0 ? { $in: tags.map(t => mongoose.Types.ObjectId(t._id)) } : null,
        title: query !== "" ? { $regex: query, $options: 'i' } : null,
        limit: doclimit,
        sort: { _id: -1 },
        skip: bookmarks.length,
    }

    Object.keys(obj).forEach(key =>
    {
        if (obj[key] === null)
        {
            delete obj[key];
        }
    });

    console.log(obj)

    const userdata = await getUserdata(req, res)
    const user = await User.findOne({ _id: userdata._id, }
    ).populate(
        'bookmarks',
        null,
        obj
    )
    Redirects_SR.Api.sendApi(res, user.bookmarks)
}))

router.post('/:id/bookmarks/count/api', apiSecret, isLogged_CS, tryAsync_CS(async (req, res) =>
{
    const { query, tags } = req.body;
    const userdata = await getUserdata(req, res)

    let obj = {
        tags: tags.length > 0 ? { $in: tags.map(t => mongoose.Types.ObjectId(t._id)) } : null,
        title: query !== "" ? { $regex: query, $options: 'i' } : null,
    }

    Object.keys(obj).forEach(key =>
    {
        if (obj[key] === null)
        {
            delete obj[key];
        }
    });

    console.log(obj)

    const user = await User.findOne({ _id: userdata._id, }
    ).populate(
        'bookmarks',
        null,
        obj
    )
    Redirects_SR.Api.sendApi(res, user.bookmarks.length)
}))

router.post('/theme', apiSecret, isLogged_CS, tryAsync_CS(async (req, res) =>
{
    const { light } = req.body;
    req.session.light = !light
    Redirects_SR.Api.sendApi(res, !light)
}))

router.post('/style', apiSecret, isLogged_CS, tryAsync_CS(async (req, res) =>
{
    const { newStyle } = req.body;
    req.session.style = newStyle
    Redirects_SR.Api.sendApi(res, newStyle)
}))

router.post('/sort', apiSecret, isLogged_CS, tryAsync_CS(async (req, res) =>
{
    const { newSort } = req.body;
    req.session.sort = newSort
    Redirects_SR.Api.sendApi(res, newSort)
}))

router.post('/gallery', isLogged_CS, validateGallery, tryAsync_CS(async (req, res) =>
{
    const userdata = await getUserdata(req, res)
    const user = await User.findOne({ _id: userdata._id, status: "Active" })
    await user.processGalery(req.files, res)
    await user.save()
    Redirects_SR.Api.sendApi(res, true)
}))


router.post('/notifications/seen', apiSecret, isLogged_CS, tryAsync_CS(async (req, res) =>
{
    const userdata = await getUserdata(req, res)
    const user = await User.findOne({ _id: userdata._id })
    for (let n of user.notifications)
    {
        n.seen = true
    }
    await user.save()
    Redirects_SR.Api.sendApi(res, true)
}))

router.post('/notifications/delete/all', apiSecret, isLogged_CS, tryAsync_CS(async (req, res) =>
{
    const userdata = await getUserdata(req, res)
    const user = await User.findOne({ _id: userdata._id })
    user.notifications = []
    await user.save()
    Redirects_SR.Api.sendApi(res, true)
}))

router.post('/notifications/delete/one', apiSecret, isLogged_CS, tryAsync_CS(async (req, res) =>
{
    const { index } = req.body
    const userdata = await getUserdata(req, res)
    const user = await User.findOne({ _id: userdata._id })
    user.notifications.splice(index, 1)
    await user.save()
    Redirects_SR.Api.sendApi(res, user.notifications)
}))


router.post('/notifications/banner/last', apiSecret, isLogged_CS, tryAsync_CS(async (req, res) =>
{
    const userdata = await getUserdata(req, res)
    const user = await User.findOne({ _id: userdata._id })
    const lastNotif = user.notifications[user.notifications.length - 1]

    const seen = lastNotif ? lastNotif.banner ? lastNotif.banner.seen : true : true

    for (let n of user.notifications)
    {
        if (n.banner)
        {
            if (!n.banner.seen) n.banner.seen = true
        }
    }
    await user.save()

    Redirects_SR.Api.sendApi(res, !seen ? lastNotif.banner : null)
}))

router.post("/banner/last/api", apiSecret, isLogged_CS, tryAsync_CS(async (req, res) =>
{
    const banners = await Banner.find({ status: "Active" }).sort({ _id: -1 })
    Redirects_SR.Api.sendApi(res, banners)
}))


module.exports = router;