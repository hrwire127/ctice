const router = require('express').Router();
const { app } = require("../main")
const { tryAsync, ValidateSecret } = require('../utils/serverFunc');
const Declaration = require("../models/declaration")

router.get("/:id", tryAsync(async (req, res, next) =>
{
    app.render(req, res, `/edit/${req.params.id}`)
}))

router.post("/:id/get", tryAsync(async (req, res, next) =>
{
    const { id } = req.params;
    const declaration = await Declaration.findById(id)
    ValidateSecret(req.body.secret, () => res.json(declaration))
}))

module.exports = router; 