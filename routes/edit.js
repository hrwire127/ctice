const router = require('express').Router();
const { app } = require("../main")
const { tryAsync, ValidateSecret, isLoggedin, isClientLoggedin } = require('../utils/serverFunc');
const Declaration = require("../models/declaration")
const Redirects = require('../utils/ResRedirect');

router.get("/:id", isLoggedin, async (req, res, next) =>
{
    app.render(req, res, `/edit/${req.params.id}`)
})

router.post("/:id/api", isClientLoggedin, tryAsync(async (req, res, next) =>
{
    const { id } = req.params;
    const declaration = await Declaration.findById(id)
    console.log(declaration)
    ValidateSecret(req.body.secret, () => Redirects.Api.send(res, declaration))
}))

module.exports = router; 