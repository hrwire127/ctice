const router = require('express').Router();
const { app } = require("../main");
const { isAdmin } = require('../utilsSR/_middlewares')


router.get("/", isAdmin, (req, res) =>
{
    app.render(req, res, "/admin")
})

router.get("/declrlist", isAdmin, (req, res) =>
{
    app.render(req, res, "/admin/declrlist")
})

router.get("/userlist", isAdmin, (req, res) =>
{
    app.render(req, res, "/admin/userlist")
})

module.exports = router;