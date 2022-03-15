const express = require('express');
const router = express.Router();
const Declaration = require("../models/declaration")
const { app } = require("../main");
const tryAsync = require('../utils/tryAsync');
const { validateDbData } = require('../utils/middlewares');
const { upload, cloudDelete } = require('../cloud/storage');

router.get('/', tryAsync(async (req, res, next) =>
{
    const declarations = await Declaration.find({})
    app.render(req, res, "/", { declarations })
}))

router.post('/', upload.single('file'), tryAsync(async (req, res, next) =>
{
    console.log(req.body)
    console.log(req.file)

    const declrObj = {
        ...req.body,
    }
    if (req.file)
    {
        declrObj.file = {
            name: req.file.originalname,
            url: req.file.path,
            location: req.file.filename
        }
    }
    else
    {
        declrObj.file = null
    }
    const declaration = new Declaration(declrObj)
    await declaration.save();
    res.send("/")
}))

router.post('/validate', validateDbData)

router.get("/create", (req, res) =>
{
    app.render(req, res, "/create")
})

module.exports = router;


//create file \/, - file  \/
//edit file => file \/ , (new \/ | modfified) -file => file \/, -file => -file  , file => -file  \/
//delete file, -file