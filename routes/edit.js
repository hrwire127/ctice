const router = require('express').Router();
const { app } = require("../main")
const Declaration = require("../models/declaration")
const Redirects_SR = require('../utilsSR/general/SR_Redirects');
const { tryAsync_CS, apiSecret, } = require('../utilsSR/middlewares/_m_basic')
const { isLogged_SR, isLogged_CS, isAdmin_CS, } = require('../utilsSR/middlewares/_m_user')

router.get("/:id", isLogged_SR, isAdmin_CS, async (req, res) =>
{
    const { id } = req.params;
    app.render(req, res, `/edit/${id}`)
})

router.post("/:id/api", apiSecret, isLogged_CS, isAdmin_CS, tryAsync_CS(async (req, res) =>
{
    const { id } = req.params;
    const declaration = await Declaration.findOne({_id: id, status: "Active"})
    Redirects_SR.Api.sendApi(res, declaration)
}))

module.exports = router;