const router = require('express').Router();
const { app } = require("../main");
const Declaration = require("../models/declaration");
const mongoose = require('mongoose')
const Redirects_SR = require('../utilsSR/general/SR_Redirects');
const { tryAsync_CS, apiSecret, } = require('../utilsSR/middlewares/_m_basic')
const { isLogged_SR, isLogged_CS, isAdmin_SR, isAdmin_CS, } = require('../utilsSR/middlewares/_m_user')
const { switchSort, sortByScore } = require('../utilsSR/primary/_p_basic')
const { validateDeclr } = require('../utilsSR/middlewares/_m_validations')

router.get('/', (req, res) =>
{
    app.render(req, res, "/")
})

router.get("/create", isLogged_SR, isAdmin_SR, (req, res) =>
{
    app.render(req, res, "/create")
})

router.post('/', isLogged_CS, isAdmin_CS, validateDeclr, tryAsync_CS(async (req, res) =>
{
    const Obj = await Declaration.processObj(req);
    const declaration = new Declaration(Obj)
    await declaration.save();
    req.flash('success', 'Created Successfuly');
    Redirects_SR.Home.CS(res)
}))

router.post('/load/all/api', apiSecret, tryAsync_CS(async (req, res) =>
{
    const declarations = await Declaration.find({})
    Redirects_SR.Api.sendApi(res, declarations)
}))

router.post('/load/limit/api', apiSecret, tryAsync_CS(async (req, res) =>
{
    const { declarations, query, date, doclimit, sort } = req.body;
    
    let newDeclarations = [];

    const pipeline = [
        { $match: { _id: { $nin: declarations.map(el => mongoose.Types.ObjectId(el._id)) } } },
        query !== "" ? { $match: { title: { $regex: query, $options: 'i' } } } : null,
        date !== "Invalid" ? { $addFields: { last: { $substr: [{ $last: "$date" }, 0, 10] } } } : null,
        date !== "Invalid" ? { $match: { last: date.substring(0, 10) } } : null,
        { $match: { status: "Active" } },
        { $sort: { _id: -1 } },
        sort !== "score" ? { $limit: doclimit } : null,
    ].filter(x => x !== null)

    await switchSort(sort, async () =>
    {
        newDeclarations = await Declaration.aggregate(pipeline)
    }, async () =>
    {
        newDeclarations = sortByScore(await Declaration.aggregate(pipeline))
        newDeclarations.splice(doclimit, newDeclarations.length)
    })

    Redirects_SR.Api.sendApi(res, newDeclarations)
}))

router.post('/count/all/api', apiSecret, tryAsync_CS(async (req, res) =>
{
    const count = await Declaration.count({ status: "Active" })
    Redirects_SR.Api.sendApi(res, count)
}))

router.post('/count/limit/api', apiSecret, tryAsync_CS(async (req, res) =>
{
    const { query, date } = req.body;
    let obj = [];
    const pipeline = [
        date !== "Invalid" ? { $addFields: { last: { $substr: [{ $last: "$date" }, 0, 10] } } } : null,
        date !== "Invalid" ? { $match: { last: date.substring(0, 10) } } : null,
        query !== "" ? { $match: { title: { $regex: query, $options: 'i' } } } : null,
        { $match: { status: "Active" } },
        { $count: "count" }
    ].filter(x => x !== null)

    obj = await Declaration.aggregate(pipeline)

    Redirects_SR.Api.sendApi(res, obj.length > 0 ? obj[0].count : 0)
}))

module.exports = router;