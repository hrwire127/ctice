const router = require('express').Router();
const { app } = require("../main")
const Declaration = require("../models/declaration")
const Redirects = require('../utilsSR/Redirects');
const { validateDeclr, isLogged_CS, tryAsync_CS, apiSecret } = require('../utilsSR/_middlewares')
const { ProcessDeclr } = require('../utilsSR/_primary')

router.get("/:id", (req, res) =>
{
    app.render(req, res, `/view/${req.params.id}`)
})

router.post("/:id/api", apiSecret, tryAsync_CS(async (req, res) =>
{
    const { id } = req.params;
    const declaration = await Declaration.findById(id)
    Redirects.Api.sendObj(res, declaration)
}))

router.put("/:id", isLogged_CS, validateDeclr, tryAsync_CS(async (req, res) =>
{
    const { id } = req.params;
    let declaration = await Declaration.findById(id)
    const Obj = await ProcessDeclr(req.body, req.files, declaration);
    await Declaration.findByIdAndUpdate(id, Obj)
    req.flash('success', 'Edited Successfuly');
    Redirects.Home.CS(res)
}))

router.delete("/:id", isLogged_CS, tryAsync_CS(async (req, res) =>
{
    const { id } = req.params;
    const declaration = await Declaration.findById(id);
    await ProcessDeclr(req.body, req.files, declaration, true)
    await Declaration.findByIdAndDelete(id)
    req.flash('info', 'Deleted Successfuly');
    Redirects.Home.CS(res)
}))

module.exports = router;