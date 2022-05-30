const router = require('express').Router();
const { app } = require("../main");
const Declaration = require("../models/declaration");
const Redirects_SR = require('../utilsSR/general/SR_Redirects');
const { tryAsync_CS, apiSecret, } = require('../utilsSR/middlewares/_m_basic')
const { isLogged_SR, isLogged_CS, isAdmin_SR, isAdmin_CS, } = require('../utilsSR/middlewares/_m_user')
const { switchSort, sortByScore } = require('../utilsSR/primary/_p_basic')
const { limitNan, limitFilter, allDateCount, allQueryCount, limitFilterCount, limitDate, limitQuery, } = require('../utilsSR/primary/_p_declrApi')
const { validateDeclr } = require('../utilsSR/middlewares/_m_validations')


router.get('/', (req, res) =>
{
    app.render(req, res, "/")
})

router.post('/loadall/api', apiSecret, tryAsync_CS(async (req, res) =>
{
    const declarations = await Declaration.find({})
    Redirects_SR.Api.sendApi(res, declarations)
}))

router.post('/loadlimit/api', apiSecret, tryAsync_CS(async (req, res) =>
{
    const { declarations, query, date, doclimit, sort } = req.body;
    let newDeclarations = [];
    if (query === "" && date === "Invalid") newDeclarations = await limitNan(declarations, doclimit, sort)
    else if (date === "Invalid") newDeclarations = await limitQuery(query, declarations, doclimit, sort)
    else if (query === "") newDeclarations = await limitDate(date, declarations, doclimit, sort)
    else newDeclarations = await limitFilter(query, date, declarations, doclimit, sort)

    Redirects_SR.Api.sendApi(res, newDeclarations)
}))

router.post('/countall/api', apiSecret, tryAsync_CS(async (req, res) =>
{
    const count = await Declaration.count({ status: "Active" })
    Redirects_SR.Api.sendApi(res, count)
}))

router.post('/countlimit/api', apiSecret, tryAsync_CS(async (req, res) =>
{
    const { query, date } = req.body;
    let obj = [];

    if (query === "") obj = await allDateCount(date)
    else if (date === "Invalid") obj.push({ count: await allQueryCount(query) })
    else obj = await limitFilterCount(date, query)

    if (obj.length === 0) obj.push({ count: 0 })
    Redirects_SR.Api.sendApi(res, obj[0].count)
}))

router.post('/query/api', apiSecret, tryAsync_CS(async (req, res) =>
{
    const { query, doclimit, sort } = req.body;
    let declarations = [];
    await switchSort(sort, async () =>
    {
        declarations = await Declaration.find({ title: { $regex: query, $options: "i" }, status: "Active" }).sort({ _id: -1 }).limit(doclimit)
    }, async () =>
    {
        declarations = sortByScore(await Declaration.find({ title: { $regex: query, $options: "i" }, status: "Active" }))
        declarations.splice(doclimit, declarations.length)
    })
    Redirects_SR.Api.sendApi(res, declarations)
}))

router.post('/date/api', apiSecret, tryAsync_CS(async (req, res) =>
{
    const { date, doclimit, sort } = req.body;
    let declarations = []
    await switchSort(sort, async () =>
    {
        declarations = await Declaration.aggregate([
            { $addFields: { last: { $substr: [{ $last: "$date" }, 0, 10] } } },
            { $match: { last: date.substring(0, 10) } },
            { $match: { status: "Active" } },
            { $sort: { _id: -1 } },
            { $limit: doclimit },
        ])
    }, async () =>
    {
        declarations = sortByScore(await Declaration.aggregate([
            { $addFields: { last: { $substr: [{ $last: "$date" }, 0, 10] } } },
            { $match: { last: date.substring(0, 10) } },
            { $match: { status: "Active" } },
            { $limit: doclimit },
        ]))
        // declarations.splice(doclimit, declarations.length)
    })

    Redirects_SR.Api.sendApi(res, declarations)
}))

router.post('/datequery/api', apiSecret, tryAsync_CS(async (req, res) =>
{
    const { date, query, doclimit, sort } = req.body;
    let declarations = []
    await switchSort(sort, async () =>
    {
        declarations = await Declaration.aggregate([
            { $addFields: { last: { $substr: [{ $last: "$date" }, 0, 10] } } },
            { $match: { last: date.substring(0, 10) } },
            { $addFields: { includes: { $regexMatch: { input: "$title", regex: query, options: "i" } } } }, //<====
            { $match: { includes: true } },
            { $match: { status: "Active" } },
            { $sort: { _id: -1 } },
            { $limit: doclimit },
        ])
    }, async () =>
    {
        declarations = sortByScore(await Declaration.aggregate([
            { $addFields: { last: { $substr: [{ $last: "$date" }, 0, 10] } } },
            { $match: { last: date.substring(0, 10) } },
            { $addFields: { includes: { $regexMatch: { input: "$title", regex: query, options: "i" } } } }, //<====
            { $match: { includes: true } },
            { $match: { status: "Active" } },
            { $limit: doclimit },
        ]))
        // declarations.splice(doclimit, declarations.length)
    })
    Redirects_SR.Api.sendApi(res, declarations)
}))

router.post('/', isLogged_CS, isAdmin_CS, validateDeclr, tryAsync_CS(async (req, res) =>
{
    const Obj = await Declaration.processObj(req);
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