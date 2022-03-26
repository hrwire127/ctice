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
    const declrObj = {
        ...req.body,
    }
    if (file)
    {
        console.log("44")
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
    res.send("/")
    res.redirect("/")
}))

router.get("/create", (req, res) =>
{
    app.render(req, res, "/create")
})

module.exports = router;


//create file , - file 
//edit file => file  \/, (new | modfified) -file => file \/, -file => -file \/, file => -file \/
//delete file, -file