const { excRule } = require('./exc-Rule');
const userError = require('./userError');
const { cloud } = require('../cloud/storage');
const { Redirects_SR } = require('./SR_Redirects');
const User = require("../models/user");
const Pending = require("../models/pending")
const nodemailer = require('../config/nodemailer')
const Declaration = require("../models/declaration");


function getUser(req, res)
{
    const session = req.session.passport
    if (session) 
    {
        return session.user;
    }
    Redirects_SR.Error.CS(res)
}

async function sendEmail(pending)
{
    await nodemailer.sendConfirmationEmail(
        pending.username,
        pending.email,
        pending.confirmationCode
    )
}

async function limitNan(declarations)
{
    if(!declarations) return []
    return await Declaration.find({ _id: { $nin: declarations } }).limit(process.env.DOCS_LOAD_LIMIT);
}

async function limitNanFilter(query, date, declarations)
{
    if(!query && !date && !declarations) return []
    let newDeclarations = [];
    const queryDeclarations = await Declaration.find({
        $and: [
            { _id: { $nin: declarations } },
            { title: { $regex: query, $options: "i" } }
        ]
    })
    queryDeclarations.forEach((el) =>
    {
        if (el.date[el.date.length - 1].toISOString().substring(0, 10) === date.substring(0, 10)) 
        {
            newDeclarations.push(el)
        }
    })
    newDeclarations.slice(0, process.env.DOCS_LOAD_LIMIT)

    return newDeclarations;
}

async function allDateCount(date)
{
    if(!date) return [{count: 0}]
    return await Declaration.aggregate([
        { $addFields: { last: { $substr: [{ $last: "$date" }, 0, 10] } } },
        { $match: { last: date.substring(0, 10) } },
        { $count: "count" }
    ])
}

async function allQueryCount(query)
{
    if(!query) return 0
    return await Declaration.count({ title: { $regex: query, $options: "i" } })
}

async function limitFilterCount(date, query)
{
    if(!query && !date) return [{count: 0}]
    return await Declaration.aggregate([
        { $addFields: { last: { $substr: [{ $last: "$date" }, 0, 10] } } },
        { $match: { last: date.substring(0, 10) } },
        { $match: { title: { $regex: query, $options: 'i' } } },
        { $count: "count" }
    ])
}

module.exports =
{
    sendEmail, getUser, limitNan, limitNanFilter, allDateCount, allQueryCount, limitFilterCount
}