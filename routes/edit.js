const express = require('express');
const router = express.Router();
const Declaration = require("../models/declaration")
const { app } = require("../main")
const ServerError = require('../utils/ServerError');
const tryAsync = require('../utils/tryAsync');

router.get("/:id", tryAsync(async (req, res, next) =>
{
    const { id } = req.params;
    const declaration = await Declaration.findById(id)
    app.render(req, res, "/edit", { declaration })
}))

module.exports = router; 