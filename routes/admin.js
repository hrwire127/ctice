const router = require('express').Router();
const { app } = require("../main");
const { isAdmin } = require('../utils/_middlewares')

router.get("/", isAdmin, (req, res) =>
{
    app.render(req, res, "/admin", { admin: true })
})

module.exports = router;