const router = require('express').Router();
const { app } = require("../main");
const Declaration = require("../models/declaration");
const Redirects = require('../utils/Redirects');
const { validateDbData, isLoggedin, isClientLoggedin, tryClientAsync, ValidateSecret, } = require('../utils/_primary')
const { processData} = require('../utils/_tertiary')

router.get('/', (req, res, next) =>
{
    app.render(req, res, "/")
})


router.post('/api', tryClientAsync(async (req, res, next) =>
{
    const declarations = await Declaration.find({})
    ValidateSecret(req.body.secret, () => Redirects.Api.send(res, declarations))
}))


router.post('/', isClientLoggedin, validateDbData, tryClientAsync(async (req, res, next) =>
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

