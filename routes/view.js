const router = require('express').Router();
const { app } = require("../main")
const { validateDbData, tryAsync, StorageUpload } = require('../utils/serverFunc');
const Declaration = require("../models/declaration")
const { cloud } = require('../cloud/storage');
const { FileRule } = require('../utils/serverRules');

router.get("/:id", tryAsync(async (req, res, next) =>
{
    app.render(req, res, `/view/${req.params.id}`)
}))

router.post("/:id/get", tryAsync(async (req, res, next) =>
{
    const { id } = req.params;
    await Declaration.findById(id)
        .then(declaration =>
        {
            res.json(declaration);
        }).catch(err =>
        {
            res.json("Error")
        })
}))

router.put("/:id", validateDbData, tryAsync(async (req, res, next) =>
{
    const { id } = req.params;
    let declaration = await Declaration.findById(id)
    const Obj = await new FileRule(req.body, req.files, declaration).processObj(StorageUpload, cloud);
    await Declaration.findByIdAndUpdate(id, Obj)
    res.json({ status: "Success", redirect: '/' });
}))

router.delete("/:id", tryAsync(async (req, res, next) =>
{
    const { id } = req.params;
    const declaration = await Declaration.findById(id);
    if (declaration.file.location)
    {
        await cloud.destroy(
            declaration.file.location,
        );
    }
    await Declaration.findByIdAndDelete(id)
    res.json({ status: "Success", redirect: '/' });
}))

module.exports = router;