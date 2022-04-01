const router = require('express').Router();
const { app } = require("../main")
const { tryAsync } = require('../utils/serverFunc');
const Declaration = require("../models/declaration")
const ServerError = require('../utils/ServerError');

router.get("/:id", tryAsync(async (req, res, next) =>
{
    app.render(req, res, `/edit/${req.params.id}`)
}))

router.post("/:id", tryAsync(async (req, res, next) =>
{
    const { id } = req.params;
    await Declaration.findById(id)
        .then(declaration =>
        {
            res.json(declaration);
        }).catch(err =>
        {
            res.json("Error")
        })
}))

module.exports = router; 