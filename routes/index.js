const router = require('express').Router();
const { app } = require("../main");
const Declaration = require("../models/declaration");
<<<<<<< HEAD
const Redirects = require('../utilsSR/Redirects');
const { validateDeclr, isLogged_SR, isLogged_CS, tryAsync_CS, apiSecret } = require('../utilsSR/_middlewares')
const { ProcessDeclr } = require('../utilsSR/_primary')
=======
const Redirects = require('../utils/Redirects');
const { validateDeclr, isLogged_SR, isLogged_CS, tryAsync_CS, apiSecret } = require('../utils/_middlewares')
const { ProcessDeclr } = require('../utils/_primary')
>>>>>>> 3a6d6164f1a207ed8e5c2b711b029497d99e147b

router.get('/', (req, res) =>
{
    app.render(req, res, "/")
})


router.post('/api', apiSecret, tryAsync_CS(async (req, res) =>
{
    const declarations = await Declaration.find({})
    Redirects.Api.sendObj(res, declarations)
}))


router.post('/', isLogged_CS, validateDeclr, tryAsync_CS(async (req, res) =>
{
    const Obj = await ProcessDeclr(req.body, req.files);
    const declaration = new Declaration(Obj)
    await declaration.save();
    req.flash('success', 'Created Successfuly');
    Redirects.Home.CS(res)
}))

router.get("/create", isLogged_SR, (req, res) =>
{
    app.render(req, res, "/create")
})


module.exports = router;

