const router = require('express').Router();
const { app } = require("../main");
const { isAdmin } = require('../utilsSR/_middlewares')

router.get("/", isAdmin, (req, res) =>
{
    app.render(req, res, "/admin")
})

module.exports = router;