const router = require('express').Router();
const { app } = require("../main")
const { tryAsync } = require('../utils/serverFunc');
const Declaration = require("../models/declaration")
const ServerError = require('../utils/ServerError');

router.get("/:id", tryAsync(async (req, res, next) =>
{
    const { id } = req.params;
    const declaration = await Declaration.findById(id)
    app.render(req, res, "/edit", { declaration })
}))

module.exports = router; 