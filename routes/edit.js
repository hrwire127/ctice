const router = require('express').Router();
const { app } = require("../main")
const Declaration = require("../models/declaration")
const Redirects = require('../utils/ResRedirect');
const { isLoggedin, isClientLoggedin, tryClientAsync, ValidateSecret} = require('../utils/primFunc')

router.get("/:id", isLoggedin, async (req, res, next) =>
{
    app.render(req, res, `/edit/${req.params.id}`)
})

router.post("/:id/api", isClientLoggedin, tryClientAsync(async (req, res, next) =>
{
    const { id } = req.params;
    const declaration = await Declaration.findById(id)
    console.log(declaration)
    ValidateSecret(req.body.secret, () => Redirects.Api.send(res, declaration))
}))

module.exports = router; 