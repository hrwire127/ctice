const router = require('express').Router();
const { app } = require("../main");
const { isAdmin_SR, isAdmin_CS } = require('../utilsSR/middlewares/_m_user')
const { validateBanner, validateNotification } = require('../utilsSR/middlewares/_m_validations')
const { tryAsync_CS, apiSecret } = require('../utilsSR/middlewares/_m_basic')
const Redirects_SR = require('../utilsSR/general/SR_Redirects');
const Banner = require('../models/banner')
const User = require('../models/user')

router.get("/", isAdmin_SR, (req, res) =>
{
    app.render(req, res, "/admin")
})

router.get("/declrlist", isAdmin_SR, (req, res) =>
{
    app.render(req, res, "/admin/declrlist")
})

router.get("/userlist", isAdmin_SR, (req, res) =>
{
    app.render(req, res, "/admin/userlist")
})

router.get("/banner/create", isAdmin_SR, (req, res) =>
{
    app.render(req, res, "/admin/banner/create")
})

router.get("/banner/:id", isAdmin_SR, tryAsync_CS(async (req, res) =>
{
    const { id } = req.params
    const banner = await Banner.findOne({ _id: id, status: "Active" })
    app.render(req, res, `/admin/banner/${req.params.id}`, { banner })
}))

router.get("/notification", isAdmin_SR, (req, res) =>
{
    app.render(req, res, "/admin/notification")
})

router.get("/banner/list", isAdmin_SR, (req, res) =>
{
    app.render(req, res, "/admin/banner/list")
})

router.post("/banner", isAdmin_CS, validateBanner, tryAsync_CS(async (req, res) =>
{
    const Obj = await Banner.processObj(null, req, res)
    const banner = new Banner(Obj);
    await banner.save()
    Redirects_SR.Api.sendApi(res, true)
}))

router.post("/notification", isAdmin_CS, validateNotification, tryAsync_CS(async (req, res) =>
{
    const Obj = await User.processNotification(req, res)
    await User.attachNotification(Obj);
    Redirects_SR.Api.sendApi(res, true)
}))

router.post("/banner/:id/switch", apiSecret, isAdmin_CS, tryAsync_CS(async (req, res) =>
{
    const { id } = req.params
    const banner = await Banner.findOne({ _id: id })
    banner.status = banner.status === "Active" ? "Disabled" : "Active"
    await banner.save()
    Redirects_SR.Api.sendApi(res, true)
}))

router.post("/banner/all/api", apiSecret, isAdmin_CS, tryAsync_CS(async (req, res) =>
{
    const banners = await Banner.find({}).sort({ _id: -1 })
    Redirects_SR.Api.sendApi(res, banners)
}))

router.post("/banner/:id/api", apiSecret, isAdmin_CS, tryAsync_CS(async (req, res) =>
{
    const { id } = req.params
    const banner = await Banner.findOne({ _id: id, status: "Active" })
    Redirects_SR.Api.sendApi(res, banner)
}))

router.put("/banner/:id", isAdmin_CS, validateBanner, tryAsync_CS(async (req, res) =>
{
    const { id } = req.params
    const banner = await Banner.findOne({ _id: id })
    const Obj = await Banner.processObj(banner, req, res)
    await Banner.findByIdAndUpdate(id, Obj)
    Redirects_SR.Api.sendApi(res, true)
}))

router.delete("/banner/:id", isAdmin_CS, tryAsync_CS(async (req, res) =>
{
    const { id } = req.params
    const banner = await Banner.findOne({ _id: id })
    await Banner.processObj(banner)
    await Banner.findByIdAndDelete(id)
    Redirects_SR.Api.sendApi(res, true)
}))

module.exports = router;