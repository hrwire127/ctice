const router = require('express').Router();
const { app } = require("../main")
const { validateDbData, tryAsync, StorageUpload } = require('../utils/serverFunc');
const Declaration = require("../models/declaration")
const { cloud } = require('../cloud/storage');
const { FileRule } = require('../utils/serverRules');
const ServerError = require('../utils/ServerError');

router.get("/:id", tryAsync(async (req, res, next) =>
{
    app.render(req, res, `/view/${req.params.id}`)
}))

router.post("/:id/get", tryAsync(async (req, res, next) =>
{
    const { id } = req.params;
    const declaration = await Declaration.findById(id)
    if (req.body === process.env.NEXT_PUBLIC_SECRET)
    {
        res.json(declaration);
    }
    else
    {
        throw new ServerError("Not Authorized", 403)
    }
}))

router.put("/:id", validateDbData, tryAsync(async (req, res, next) =>
{
    const { id } = req.params;
    let declaration = await Declaration.findById(id)
    const Obj = await new FileRule(req.body, req.files, declaration).processObj(StorageUpload, cloud);
    await Declaration.findByIdAndUpdate(id, Obj)
    res.json({ confirm: "Success", redirect: '/' });
}))

router.delete("/:id", tryAsync(async (req, res, next) =>
{
    const { id } = req.params;
    const declaration = await Declaration.findById(id);
    const Obj = await new FileRule(req.body, req.files, declaration).processObj(StorageUpload, cloud, 5);
    await Declaration.findByIdAndDelete(id)
    res.json({ confirm: "Success", redirect: '/' });
}))

module.exports = router;