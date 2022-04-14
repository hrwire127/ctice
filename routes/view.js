const router = require('express').Router();
const { app } = require("../main")
const Declaration = require("../models/declaration")
const Redirects = require('../utils/ResRedirect');
const { validateDbData, isClientLoggedin, tryClientAsync, ValidateSecret} = require('../utils/primFunc')
const { processData} = require('../utils/thirdFunc')

router.get("/:id", (req, res, next) =>
{
    app.render(req, res, `/view/${req.params.id}`) 
})

router.post("/:id/api", tryClientAsync(async (req, res, next) =>
{
    const { id } = req.params;
    const declaration = await Declaration.findById(id)
    ValidateSecret(req.body.secret, () => Redirects.Api.send(res, declaration))
}))

router.put("/:id", isClientLoggedin, validateDbData, tryClientAsync(async (req, res, next) =>
{
    const { id } = req.params;
    let declaration = await Declaration.findById(id)
    const Obj = await processData(req.body, req.files, declaration);
    await Declaration.findByIdAndUpdate(id, Obj)
    req.flash('success', 'Edited Successfuly');
    Redirects.Client.sendRes(res)
}))

router.delete("/:id", isClientLoggedin, tryClientAsync(async (req, res, next) =>
{
    const { id } = req.params;
    const declaration = await Declaration.findById(id);
    await processData(req.body, req.files, declaration, true)
    await Declaration.findByIdAndDelete(id)
    req.flash('info', 'Deleted Successfuly');
    Redirects.Client.sendRes(res)
}))

module.exports = router;