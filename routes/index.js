const express = require('express');
const router = express.Router();
const Declaration = require("../models/declaration")
const { app } = require("../main");
const tryAsync = require('../utils/tryAsync');
const { validateDbData, StorageUpload } = require('../utils/middlewares');

router.get('/', tryAsync(async (req, res, next) =>
{
    const declarations = await Declaration.find({})
    app.render(req, res, "/", { declarations })
}))

router.post('/', validateDbData, tryAsync(async (req, res, next) =>
{
    const file = req.files ? await StorageUpload(req.files.file) : null
    console.log(req.body)
    console.log(req.files)
    const declrObj = {
        ...req.body,
    }
    if (file)
    {
        declrObj.file = {
            name: req.files.file.name,
            url: file.url,
            location: file.location
        }
    }
    else
    {
        declrObj.file = null
    }

    const declaration = new Declaration(declrObj)
    await declaration.save();
    res.json({ status: "Success", redirect: '/' });
}))

router.get("/create", (req, res) =>
{
    app.render(req, res, "/create")
})

module.exports = router;


//create file , - file
//edit file => file  \/, (new | modfified) -file => file \/, -file => -file \/, file => -file \/
//delete file, -file