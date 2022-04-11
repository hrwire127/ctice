const router = require('express').Router();
const { app } = require("../main");
const { validateDbData, StorageUpload, tryAsync, ValidateSecret, processData, isLoggedin, isClientLoggedin } = require('../utils/serverFunc');
const Declaration = require("../models/declaration");
const Redirects = require('../utils/ResRedirect');

router.get('/', (req, res, next) =>
{
    app.render(req, res, "/")
})


router.post('/api', tryAsync(async (req, res, next) =>
{
    const declarations = await Declaration.find({})
    ValidateSecret(req.body.secret, () => Redirects.Api.send(res, declarations))
}))


router.post('/', isClientLoggedin, validateDbData, tryAsync(async (req, res, next) =>
{
    const Obj = await processData(req.body, req.files);
    const declaration = new Declaration(Obj)
    await declaration.save();
    req.flash('success', 'Created Successfuly');
    Redirects.Client.sendRes(res)
}))

router.get("/create", isLoggedin, (req, res) =>
{
    app.render(req, res, "/create")
})

module.exports = router;

