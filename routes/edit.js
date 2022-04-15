const router = require('express').Router();
const { app } = require("../main")
const Declaration = require("../models/declaration")
const Redirects = require('../utils/Redirects');
const { isLogged_SR, isLogged_CS, tryAsync_CS, apiSecret} = require('../utils/_primary')

router.get("/:id", isLogged_SR, async (req, res) =>
{
    const { id } = req.params;
    app.render(req, res, `/edit/${id}`)  
})

router.post("/:id/api", apiSecret, isLogged_CS, tryAsync_CS(async (req, res) =>
{
    const { id } = req.params;
    const declaration = await Declaration.findById(id)
    // return new userError(msg, 401).throw_CS()
    Redirects.Api.sendObj(res, declaration)
}))

module.exports = router;