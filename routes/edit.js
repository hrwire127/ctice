const router = require('express').Router();
const { app } = require("../main")
const { tryAsync } = require('../utils/serverFunc');
const Declaration = require("../models/declaration")
const ServerError = require('../utils/ServerError');

router.get("/:id", tryAsync(async (req, res, next) =>
{
    app.render(req, res, `/edit/${req.params.id}`)
}))

router.post("/:id/get", tryAsync(async (req, res, next) =>
{
    const { id } = req.params;
    const declaration = await Declaration.findById(id)
    if (req.body === process.env.NEXT_PUBLIC_SECRET)
    {
        res.json(declaration);
    }
    else
    {
        throw new ServerError("Not Authorized", 403)
    }
}))

module.exports = router; 