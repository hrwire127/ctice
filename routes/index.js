const router = require('express').Router();
const { app } = require("../main");
const Declaration = require("../models/declaration");
const { Redirects_SR } = require('../utilsSR/SR_Redirects');
const { validateDeclr, isLogged_SR, isLogged_CS, tryAsync_CS, apiSecret, isAdmin_SR, isAdmin_CS } = require('../utilsSR/_middlewares')
// const { processObj } = require('../utilsSR/_primary')

router.get('/', (req, res) =>
{
    app.render(req, res, "/")
})


router.post('/api', apiSecret, tryAsync_CS(async (req, res) =>
{
    const declarations = await Declaration.find({})
    Redirects_SR.Api.sendApi(res, declarations)
}))

router.post('/limit/api', apiSecret, tryAsync_CS(async (req, res) =>
{
    const { declarations } = req.body;
    const newDeclarations = await Declaration.find({ _id: { $nin: declarations } }).limit(5)

    Redirects_SR.Api.sendApi(res, newDeclarations)
}))

router.post('/count/api', apiSecret, tryAsync_CS(async (req, res) =>
{
    const count = await Declaration.count({})
    Redirects_SR.Api.sendApi(res, count)
}))

router.post('/query/api', apiSecret, tryAsync_CS(async (req, res) =>
{
    const { query } = req.body;
    const declarations = await Declaration.find({ title: { $regex: query, $options: "i" } })

    Redirects_SR.Api.sendApi(res, declarations)
}))

router.post('/date/api', apiSecret, tryAsync_CS(async (req, res) =>
{
    const { date } = req.body;
    const newDate = date.substring(0, 10)
    console.log(newDate)
    const declarations = await Declaration.aggregate([
        { $addFields: { last: { $substr: [{ $last: "$date" }, 0, 10] } } },
        { $match: { last: newDate } }
    ])
    // const declarations = await Declaration.find({ $expr: { $gt: [{ $arrayElemAt: ["$date", -1] }, date] } })
    // const declarations = await Declaration.find({ $regex: [{ $last: "$date" }, newDate], $options: "i" })
    //{ "$regex": [{ $last: "$date" }, newDate], "$options": "i" }
    //     $where: function ()
    //     {
    //         return new Date(this.date[this.date.length - 1]).toDateString() === new Date(date).toDateString()
    //     }
    // })

    Redirects_SR.Api.sendApi(res, declarations)
}))

router.post('/', isLogged_CS, isAdmin_CS, validateDeclr, tryAsync_CS(async (req, res) =>
{
    const Obj = await Declaration.processObj(req.body, req.files);
    const declaration = new Declaration(Obj)
    await declaration.save();
    req.flash('success', 'Created Successfuly');
    Redirects_SR.Home.CS(res)
}))

router.get("/create", isLogged_SR, isAdmin_SR, (req, res) =>
{
    app.render(req, res, "/create")
})


module.exports = router;

