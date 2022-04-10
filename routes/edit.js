const router = require('express').Router();
const { app } = require("../main")
const { tryAsync, ValidateSecret, isLoggedin, isClientLoggedin } = require('../utils/serverFunc');
const Declaration = require("../models/declaration")

router.get("/:id", isLoggedin, async (req, res, next) =>
{
    app.render(req, res, `/edit/${req.params.id}`)
})

router.post("/:id/api", isClientLoggedin, tryAsync(async (req, res, next) =>
{
    const { id } = req.params;
    const declaration = await Declaration.findById(id)
    console.log(declaration)
    ValidateSecret(req.body.secret, () => res.json(declaration))
}))

module.exports = router; 