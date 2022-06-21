const router = require('express').Router();
const { app } = require("../main")
const Declaration = require("../models/declaration")
const UserError = require('../utilsSR/general/userError')
const Redirects_SR = require('../utilsSR/general/SR_Redirects');
const errorMessages = require("../utilsSR/rules/errorMessages")
const { tryAsync_CS, apiSecret, tryAsync_SR } = require('../utilsSR/middlewares/_m_basic')
const { isAdmin_CS, isAdmin_SR } = require('../utilsSR/middlewares/_m_user')

router.get("/:id", isAdmin_SR, tryAsync_SR(async (req, res) =>
{
    const { id } = req.params;

    const declaration = await Declaration.findOne({ _id: id, status: "Active" })

    if (declaration) app.render(req, res, `/edit/${id}`)
    else throw new UserError(...Object.values(errorMessages.PageNotFound))

    app.render(req, res, `/edit/${id}`)
}))

router.post("/:id/api", apiSecret, isAdmin_CS, tryAsync_CS(async (req, res) =>
{
    const { id } = req.params;
    const declaration = await Declaration.findOne({ _id: id, status: "Active" })

    if (declaration) Redirects_SR.Api.sendApi(res, declaration)
    else throw new UserError(...Object.values(errorMessages.PageNotFound))
}))

module.exports = router;