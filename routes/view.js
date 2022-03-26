const express = require('express');
const router = express.Router();
const Declaration = require("../models/declaration")
const { app } = require("../main")
const ServerError = require('../utils/ServerError');
const tryAsync = require('../utils/tryAsync');
const { validateDbData, StorageUpload } = require('../utils/middlewares');
const { cloud } = require('../cloud/storage');

router.get("/:id", tryAsync(async (req, res, next) =>
{
    const { id } = req.params;
    const declaration = await Declaration.findById(id)
    app.render(req, res, "/view", { declaration })
}))

router.put("/:id", validateDbData, tryAsync(async (req, res, next) =>
{
    const { id } = req.params;
    const file = req.files ? await StorageUpload(req.files.file) : null
    let declaration = await Declaration.findById(id)
    console.log(req.body)
    console.log(file)
    console.log(declaration)
    const declrObj = {
        ...req.body
    }
    const valFile = declaration['file']['url'] !== undefined;
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
    await Declaration.findByIdAndUpdate(id, declrObj)
    console.log(declrObj)
    res.json({status: "Success", redirect: '/'});
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
    res.json({status: "Success", redirect: '/'});
}))

module.exports = router;