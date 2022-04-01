const router = require('express').Router();
const { app } = require("../main")
const { validateDbData, StorageUpload, tryAsync, processFile } = require('../utils/serverFunc');
const Declaration = require("../models/declaration")
const ServerError = require('../utils/ServerError');
const { cloud } = require('../cloud/storage');

router.get("/:id", tryAsync(async (req, res, next) =>
{
    app.render(req, res, `/view/${req.params.id}`)
}))

router.post("/:id", tryAsync(async (req, res, next) =>
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
    const file = req.files ? await StorageUpload(req.files.file) : undefined
    let declaration = await Declaration.findById(id)
    //1: req.body && file && declaration; 2:req.body && file && !declaration; 3:!req.body && !file && !declaration; 4: !req.body && !file && declaration
    const valFile = declaration['file']['url'] !== undefined;
    console.log(req.body)
    console.log(file)
    console.log(declaration)
    console.log(valFile)
    processFile(req.body.file, file, valFile)
    const declrObj = {
        ...req.body
    }
    if (file)
    {
        declrObj.file = {
            name: req.files.file.name,
            url: file.url,
            location: file.location
        }
        if (valFile)
        {
            await cloud.destroy(
                declaration.file.location,
            );
        }
    }
    if (!req.body.file && valFile)
    {
        await cloud.destroy(
            declaration.file.location,
        );
    }
    if (!file && valFile)
    {
        delete declrObj.file
        declaration.file = undefined
        await declaration.save();
    }
    else if(!file && req.body.file)
    {
        declrObj.file = declaration.file
    }
    console.log(declrObj)
    await Declaration.findByIdAndUpdate(id, declrObj)
    res.json({ status: "Success", redirect: '/' });
}))

router.delete("/:id", tryAsync(async (req, res, next) =>
{
    const { id } = req.params;
    const declaration = await Declaration.findById(id);
    console.log(declaration)
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