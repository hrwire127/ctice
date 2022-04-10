const router = require('express').Router();
const { app } = require("../main")
const { validateDbData, tryAsync, StorageUpload, ValidateSecret, processData, isLoggedin, isClientLoggedin } = require('../utils/serverFunc');
const Declaration = require("../models/declaration")
const { cloud } = require('../cloud/storage');
const { ProcessRule } = require('../utils/processRules');

router.get("/:id",  (req, res, next) =>
{
    app.render(req, res, `/view/${req.params.id}`)
})

router.post("/:id/api", tryAsync(async (req, res, next) =>
{
    const { id } = req.params;
    const declaration = await Declaration.findById(id)
    ValidateSecret(req.body.secret, () => res.json(declaration))
}))

router.put("/:id", isClientLoggedin, validateDbData, tryAsync(async (req, res, next) =>
{
    const { id } = req.params;
    let declaration = await Declaration.findById(id)
    const Obj = await processData(req.body, req.files, declaration);
    await Declaration.findByIdAndUpdate(id, Obj)
    res.json({ confirm: "Success", redirect: '/' });
}))

router.delete("/:id", isClientLoggedin, tryAsync(async (req, res, next) =>
{
    const { id } = req.params;
    const declaration = await Declaration.findById(id);
    await processData(req.body, req.files, declaration, true)
    await Declaration.findByIdAndDelete(id)
    res.json({ confirm: "Success", redirect: '/' });
}))

module.exports = router;