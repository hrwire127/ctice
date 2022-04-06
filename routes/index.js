const router = require('express').Router();
const { app } = require("../main");
const { validateDbData, StorageUpload, tryAsync, ValidateSecret, processData } = require('../utils/serverFunc');
const Declaration = require("../models/declaration");

router.get('/', tryAsync(async (req, res, next) =>
{
    app.render(req, res, "/")
}))


router.post('/get', tryAsync(async (req, res, next) =>
{
    const declarations = await Declaration.find({})
    ValidateSecret(req.body.secret, () => res.json(declarations))
}))


router.post('/', validateDbData, tryAsync(async (req, res, next) =>
{
    const Obj = await processData(req.body, req.files);
    const declaration = new Declaration(Obj)
    await declaration.save();
    res.json({ confirm: "Success", redirect: '/' });
}))

router.get("/create", (req, res) =>
{
    app.render(req, res, "/create")
})

module.exports = router;

