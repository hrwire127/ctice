const router = require('express').Router();
const { app } = require("../main")
const Declaration = require("../models/declaration")
const Redirects = require('../utils/Redirects');
const { isLoggedin, isClientLoggedin, tryClientAsync, ValidateSecret} = require('../utils/_primary')

router.get("/:id", isLoggedin, async (req, res, next) =>
{
    const { id } = req.params;
    app.render(req, res, `/edit/${id}`)
})

router.post("/:id/api", isClientLoggedin, tryClientAsync(async (req, res, next) =>
{
    const { id } = req.params;
    const declaration = await Declaration.findById(id)
    console.log(declaration)
    ValidateSecret(req.body.secret, () => Redirects.Api.send(res, declaration))
}))

module.exports = router; 