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
    if (query === "" && date === "Invalid") newDeclarations = await limitNan(declarations, doclimit, sort)
    else if (date === "Invalid") newDeclarations = await limitQuery(query, declarations, doclimit, sort)
    else if (query === "") newDeclarations = await limitDate(date, declarations, doclimit, sort)
    else newDeclarations = await limitFilter(query, date, declarations, doclimit, sort)

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

    if (query === "") obj = await allDateCount(date)
    else if (date === "Invalid") obj.push({ count: await allQueryCount(query) })
    else obj = await limitFilterCount(date, query)

    if (obj.length === 0) obj.push({ count: 0 })
    Redirects_SR.Api.sendApi(res, obj[0].count)
}))

module.exports = router;