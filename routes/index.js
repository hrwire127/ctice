const router = require('express').Router();
const { app } = require("../main");
const { validateDbData, StorageUpload, tryAsync, ValidateSecret } = require('../utils/serverFunc');
const Declaration = require("../models/declaration");
const { FileRule } = require('../utils/serverRules');
const ServerError = require('../utils/ServerError');

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
    const Obj = await new FileRule(req.body, req.files).processObj(StorageUpload);
    const declaration = new Declaration(Obj)
    await declaration.save();
    res.json({ confirm: "Success", redirect: '/' });
}))

router.get("/create", (req, res) =>
{
    app.render(req, res, "/create")
})

module.exports = router;

