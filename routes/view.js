const express = require('express');
const router = express.Router();
const Declaration = require("../models/declaration")
const { app } = require("../main")
const ServerError = require('../utils/ServerError');
const tryAsync = require('../utils/tryAsync');
const { validateDbData } = require('../utils/middlewares')
const { upload, cloudDelete } = require('../cloud/storage');

const func = tryAsync(async (req, res, next) =>
{
    console.log(req.body)
    console.log(req.file)
    const { id } = req.params;
    const declaration = await Declaration.findById(id)
    const declrObj = {
        ...req.body
    }
    const valFile = declaration.hasOwnProperty('file');
    if (req.file)
    { //- +
        declrObj.file = {
            name: req.file.originalname,
            url: req.file.path,
            location: req.file.filename
        }
        if (valFile)
        {
            cloudDelete.destroy(
                declaration.file.location,
            );
        }
    }
    if (req.body.file && valFile)
    {
        cloudDelete.destroy(
            declaration.file.location,
        );
    }
    await Declaration.findByIdAndUpdate(id, declrObj)

    res.send("/")
})

router.get("/:id", tryAsync(async (req, res, next) =>
{
    const { id } = req.params;
    const declaration = await Declaration.findById(id)
    app.render(req, res, "/view", { declaration })
}))

router.put("/:id", upload.single('file'), func)

// router.put("/:id/raw", func)

router.delete("/:id", tryAsync(async (req, res, next) =>
{
    const { id } = req.params;
    const declaration = await Declaration.findById(id);
    if (declaration.file.location)
    {
        cloudDelete.destroy(
            declaration.file.location,
        );
    }
    await Declaration.findByIdAndDelete(id)
    res.send("/")
}))

module.exports = router;