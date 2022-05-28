const router = require('express').Router();
const { app } = require("../main");
const Declaration = require("../models/declaration");
const { Redirects_SR } = require('../utilsSR/SR_Redirects');
const {
    isLogged_SR,
    isLogged_CS,
    tryAsync_CS,
    apiSecret,
    isAdmin_SR,
    isAdmin_CS,
    hasDeclrs, } = require('../utilsSR/_middlewares')
const {
    limitNan,
    limitFilter,
    allDateCount,
    allQueryCount,
    limitFilterCount,
    limitDate,
    limitQuery,
    switchSort,
    sortByScore } = require('../utilsSR/_primary')
const { validateDeclr,
    validateApiQuery,
    validateApiDate
} = require('../utilsSR/_validations')


router.get('/', (req, res) =>
{
    app.render(req, res, "/")
})

router.post('/loadall/api', apiSecret, tryAsync_CS(async (req, res) =>
{
    const declarations = await Declaration.find({})
    Redirects_SR.Api.sendApi(res, declarations)
}))

router.post('/loadlimit/api', apiSecret, hasDeclrs, validateApiQuery, validateApiDate, tryAsync_CS(async (req, res) =>
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
    const count = await Declaration.count({})
    Redirects_SR.Api.sendApi(res, count)
}))

router.post('/countlimit/api', apiSecret, validateApiQuery, validateApiDate, tryAsync_CS(async (req, res) =>
{
    const { query, date } = req.body;
    let obj = [];

    if (query === "") obj = await allDateCount(date)
    else if (date === "Invalid") obj.push({ count: await allQueryCount(query) })
    else obj = await limitFilterCount(date, query)

    if (obj.length === 0) obj.push({ count: 0 })
    Redirects_SR.Api.sendApi(res, obj[0].count)
}))

router.post('/query/api', apiSecret, validateApiQuery, tryAsync_CS(async (req, res) =>
{
    const { query, doclimit, sort } = req.body;
    let declarations = [];
    await switchSort(sort, async () =>
    {
        declarations = await Declaration.find({ title: { $regex: query, $options: "i" } }).sort({ _id: -1 }).limit(doclimit)
    }, async () =>
    {
        declarations = sortByScore(await Declaration.find({ title: { $regex: query, $options: "i" } }))
        declarations.splice(doclimit, declarations.length)
    })
    Redirects_SR.Api.sendApi(res, declarations)
}))

router.post('/date/api', apiSecret, validateApiDate, tryAsync_CS(async (req, res) =>
{
    const { date, doclimit, sort } = req.body;
    let declarations = []
    await switchSort(sort, async () =>
    {
        declarations = await Declaration.aggregate([
            { $addFields: { last: { $substr: [{ $last: "$date" }, 0, 10] } } },
            { $match: { last: date.substring(0, 10) } },
            { $sort: { _id: -1 } },
            { $limit: doclimit },
        ])
    }, async () =>
    {
        declarations = sortByScore(await Declaration.aggregate([
            { $addFields: { last: { $substr: [{ $last: "$date" }, 0, 10] } } },
            { $match: { last: date.substring(0, 10) } }]))
        declarations.splice(doclimit, declarations.length)
    })

    Redirects_SR.Api.sendApi(res, declarations)
}))

router.post('/datequery/api', apiSecret, validateApiDate, tryAsync_CS(async (req, res) =>
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
            { $sort: { _id: -1 } },
            { $limit: doclimit },
        ])
    }, async () =>
    {
        declarations = sortByScore(await Declaration.aggregate([
            { $addFields: { last: { $substr: [{ $last: "$date" }, 0, 10] } } },
            { $match: { last: date.substring(0, 10) } },
            { $addFields: { includes: { $regexMatch: { input: "$title", regex: query, options: "i" } } } }, //<====
            { $match: { includes: true } }
        ]))
        declarations.splice(doclimit, declarations.length)
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