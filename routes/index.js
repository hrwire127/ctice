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
    const { declarations, query, date } = req.body;
    let newDeclarations = [];
    if (query === "" && date === "Invalid")
    {
        newDeclarations = await Declaration.find({ _id: { $nin: declarations } }).limit(process.env.DOCS_LOAD_LIMIT)
    }
    else
    {
        const queryDeclarations = await Declaration.find({
            $and: [
                { _id: { $nin: declarations } },
                { title: { $regex: query, $options: "i" } }
            ]
        }) 
        console.log(queryDeclarations)
        queryDeclarations.forEach((el) =>
        {
            const eldate = el.date[el.date.length - 1].toISOString().substring(0, 10)
            if (eldate === date.substring(0, 10)) newDeclarations.push(el)
        })
        newDeclarations.slice(0, 5)
    }

    Redirects_SR.Api.sendApi(res, newDeclarations)
}))

router.post('/countall/api', apiSecret, tryAsync_CS(async (req, res) =>
{
    const count = await Declaration.count({})
    Redirects_SR.Api.sendApi(res, count)
}))

router.post('/countlimit/api', apiSecret, tryAsync_CS(async (req, res) =>
{
    const { query, date } = req.body;
    const queryCount = query === "" ? 0 : await Declaration.count({ title: { $regex: query, $options: "i" } })
    const dateCount = date === "Invalid" ? 0 : await Declaration.aggregate([
        { $addFields: { last: { $substr: [{ $last: "$date" }, 0, 10] } } },
        { $match: { last: date.substring(0, 10) } },
        { $count: "count" }
    ])
    const sum = queryCount + (dateCount.length > 0 ? dateCount[0].count : 0)
    Redirects_SR.Api.sendApi(res, sum)
}))

router.post('/query/api', apiSecret, tryAsync_CS(async (req, res) =>
{
    const { query } = req.body; //declrs 
    const declarations = await Declaration.find({ title: { $regex: query, $options: "i" } }).limit(process.env.DOCS_LOAD_LIMIT)

    Redirects_SR.Api.sendApi(res, declarations)
}))

router.post('/date/api', apiSecret, tryAsync_CS(async (req, res) =>
{
    const { date } = req.body; //declrs 
    const declarations = await Declaration.aggregate([
        { $addFields: { last: { $substr: [{ $last: "$date" }, 0, 10] } } },
        { $match: { last: date.substring(0, 10) } },
        { $limit: 5 }
    ])

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

