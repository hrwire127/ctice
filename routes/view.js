const express = require('express');
const router = express.Router();
const Declaration = require("../models/declaration")
const { app } = require("../main")
const ServerError = require('../utils/ServerError');
const tryAsync = require('../utils/tryAsync');
const { validateDbData, StorageUpload } = require('../utils/middlewares');

const func = tryAsync(async (req, res, next) =>
{
    console.log(req.body)
    console.log(req.files.file)
    if(req.files.file)
    {
        const res = StorageUpload(req.files.file) 
        console.log(res)
    }
    // console.log(url, location)
    // const { id } = req.params;
    // const declaration = await Declaration.findById(id)
    // const declrObj = {
    //     ...req.body
    // }
    // const valFile = declaration.hasOwnProperty('file');
    // if (req.files.file)
    // { //- +
    //     declrObj.file = {
    //         name: req.files.file.name,
    //         url: url,
    //         location: location
    //     }
    //     if (valFile)
    //     {
    //         await cloud.destroy(
    //             declaration.file.location,
    //         );
    //     }
    // }
    // if (req.body.file && valFile)
    // {
    //     await cloud.destroy(
    //         declaration.file.location,
    //     );
    // }
    // console.log(declrObj)
    // await Declaration.findByIdAndUpdate(id, declrObj)

    res.send("/")
})

router.get("/:id", tryAsync(async (req, res, next) =>
{
    const { id } = req.params;
    const declaration = await Declaration.findById(id)
    app.render(req, res, "/view", { declaration })
}))

router.put("/:id", validateDbData, func)

// router.post('/validate', validateDbData)

// router.put("/:id/raw", func)

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
    res.send("/")
}))

module.exports = router;