const router = require('express').Router();
const { app } = require("../main")
const { validateDbData, tryAsync, StorageUpload, ValidateSecret, processData, isLoggedin, isClientLoggedin } = require('../utils/serverFunc');
const Declaration = require("../models/declaration")
const Redirects = require('../utils/ResRedirect');

router.get("/:id", (req, res, next) =>
{
    app.render(req, res, `/view/${req.params.id}`)
})

router.post("/:id/api", tryAsync(async (req, res, next) =>
{
    const { id } = req.params;
    const declaration = await Declaration.findById(id)
    ValidateSecret(req.body.secret, () => Redirects.Api.send(res, declaration))
}))

router.put("/:id", isClientLoggedin, validateDbData, tryAsync(async (req, res, next) =>
{
    const { id } = req.params;
    let declaration = await Declaration.findById(id)
    const Obj = await processData(req.body, req.files, declaration);
    await Declaration.findByIdAndUpdate(id, Obj)
    req.flash('success', 'Edited Successfuly');
    Redirects.Client.sendRes(res)
}))

router.delete("/:id", isClientLoggedin, tryAsync(async (req, res, next) =>
{
    const { id } = req.params;
    const declaration = await Declaration.findById(id);
    await processData(req.body, req.files, declaration, true)
    await Declaration.findByIdAndDelete(id)
    req.flash('info', 'Deleted Successfuly');
    Redirects.Client.sendRes(res)
}))

module.exports = router;