const router = require('express').Router();
const { app } = require("../main")
const Declaration = require("../models/declaration")
const {Redirects_SR} = require('../utilsSR/SR_Redirects');
const { isLogged_SR, isLogged_CS, tryAsync_CS, apiSecret} = require('../utilsSR/_middlewares')

router.get("/:id", isLogged_SR, async (req, res) =>
{
    const { id } = req.params;
    app.render(req, res, `/edit/${id}`)  
})

router.post("/:id/api", apiSecret, isLogged_CS, tryAsync_CS(async (req, res) =>
{
    const { id } = req.params;
    const declaration = await Declaration.findById(id)
    Redirects_SR.Api.sendApi(res, declaration)
}))

module.exports = router;