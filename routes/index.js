const router = require('express').Router();
const { app } = require("../main");
const { validateDbData, StorageUpload, tryAsync } = require('../utils/serverFunc');
const Declaration = require("../models/declaration");
const { FileRule } = require('../utils/serverRules');

router.get('/', tryAsync(async (req, res, next) =>
{
    app.render(req, res, "/")
}))


router.post('/get', tryAsync(async (req, res, next) =>
{
    await Declaration.find({})
        .then(declarations =>
        {
            res.json(declarations);
        }).catch(err =>
        {
            res.json("Error")
        })
}))


router.post('/', validateDbData, tryAsync(async (req, res, next) =>
{
    const Obj = await new FileRule(req.body, req.files).processObj(StorageUpload);
    console.log(Obj)
    // const file = req.files ? await StorageUpload(req.files.file) : null
    // const declrObj = {
    //     ...req.body,
    // }
    // if (file)
    // {
    //     declrObj.file = {
    //         name: req.files.file.name,
    //         url: file.url,
    //         location: file.location
    //     }
    // }
    // else
    // {
    //     declrObj.file = null
    // }

    const declaration = new Declaration(Obj)
    await declaration.save();
    res.json({ status: "Success", redirect: '/' });
}))

router.get("/create", (req, res) =>
{
    app.render(req, res, "/create")
})

module.exports = router;

