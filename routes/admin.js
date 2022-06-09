const router = require('express').Router();
const { app } = require("../main");
const { isAdmin_SR } = require('../utilsSR/middlewares/_m_user')

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

router.get("/banner", isAdmin_SR, (req, res) =>
{
    app.render(req, res, "/admin/banner")
})

module.exports = router;