const router = require('express').Router();
const { app } = require("../main");
const UserError = require('../utilsSR/general/UserError')
const Declaration = require("../models/declaration");
const Tag = require("../models/tag");
const mongoose = require('mongoose')
const Redirects_SR = require('../utilsSR/general/SR_Redirects');
const { tryAsync_CS, apiSecret, tryAsync_SR } = require('../utilsSR/middlewares/_m_basic')
const { isLogged_SR, isLogged_CS, isAdmin_SR, isAdmin_CS, } = require('../utilsSR/middlewares/_m_user')
const { switchSort, sortByScore } = require('../utilsSR/primary/_p_basic')
const { validateDeclr, validateTag } = require('../utilsSR/middlewares/_m_validations')

router.get('/', tryAsync_SR(async (req, res) =>
{
    app.render(req, res, "/")
}))

router.get("/create", isLogged_SR, isAdmin_SR, (req, res) =>
{
    app.render(req, res, "/create", { styleNonce: res.locals.styleNonce, scriptNonce: res.locals.scriptNonce })
})

router.post('/', isLogged_CS, isAdmin_CS, validateDeclr, tryAsync_CS(async (req, res) =>
{
    const Obj = await Declaration.processObj(req, res);
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
    const { declarations, query, date, doclimit, sort, tags } = req.body;

    let newDeclarations = [];

    const pipeline = [
        { $match: { _id: { $nin: declarations.map(el => mongoose.Types.ObjectId(el._id)) } } },
        tags.length > 0 ? { $match: { tags: { $in: tags.map(t => mongoose.Types.ObjectId(t._id)) } } } : null,
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
    const { query, date, tags } = req.body;
    let obj = [];

    const pipeline = [
        tags.length > 0 ? { $match: { tags: { $in: tags.map(t => mongoose.Types.ObjectId(t._id)) } } } : null,
        date !== "Invalid" ? { $addFields: { last: { $substr: [{ $last: "$date" }, 0, 10] } } } : null,
        date !== "Invalid" ? { $match: { last: date.substring(0, 10) } } : null,
        query !== "" ? { $match: { title: { $regex: query, $options: 'i' } } } : null,
        { $match: { status: "Active" } },
        { $count: "count" }
    ].filter(x => x !== null)

    obj = await Declaration.aggregate(pipeline)

    Redirects_SR.Api.sendApi(res, obj.length > 0 ? obj[0].count : 0)
}))

router.post('/tags/all/api', apiSecret, tryAsync_CS(async (req, res) =>
{
    const tags = await Tag.find({})
    Redirects_SR.Api.sendApi(res, tags)
}))

router.post('/tag', isAdmin_CS, validateTag, tryAsync_CS(async (req, res) =>
{
    const Obj = await Tag.processObj(req, res)
    const tag = new Tag(Obj)
    await tag.save();
    req.flash('success', 'Created Successfuly');
    Redirects_SR.Api.sendApi(res, tag)
}))

router.delete('/tag/:id', isAdmin_CS, tryAsync_CS(async (req, res) =>
{
    const { id } = req.params
    await Tag.findByIdAndDelete(id)
    req.flash('success', 'Created Successfuly');
    Redirects_SR.Api.sendApi(res, true)
}))

module.exports = router;