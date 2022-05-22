const { Redirects_SR } = require('./SR_Redirects');
const Declaration = require("../models/declaration");
const User = require("../models/user");
const Token = require("../models/token")
const userError = require('./userError');

async function getUserdata(req, res)
{
    return await User.findOne({ username: req.session.passport.user }, { username: 1, email: 1, status: 1, date: 1, profile: 1 })
}

function getUser(req, res)
{
    const session = req.session.passport
    if (session) 
    {
        return session.user;
    }
    Redirects_SR.Error.CS(res)
}

function verifyToken(req, res)
{
    return new Promise((resolve, reject) =>
    {
        Token.findOne({
            token: req.params.confirmationCode,
        })
            .then(async (token) =>
            {
                resolve(token)
            })
            .catch((err) => 
            {
                new userError(err.message, err.status).throw_SR(req, res)
                reject(err)
            });
    })
}
async function limitNan(declarations, doclimit)
{
    return await Declaration.find({ _id: { $nin: declarations } }).sort({ _id: -1 }).limit(doclimit);
}
async function limitQuery(query, declarations, doclimit)
{
    const queryDeclarations = await Declaration.find({
        $and: [
            { _id: { $nin: declarations } },
            { title: { $regex: query, $options: "i" } }
        ]
    }).sort({ _id: -1 }).limit(doclimit)
    queryDeclarations.slice(0, doclimit)

    return queryDeclarations;
}

async function limitDate(date, declarations, doclimit)
{
    let newDeclarations = [];
    const queryDeclarations = await Declaration.find({
        _id: { $nin: declarations }
    }).sort({ _id: -1 })
    queryDeclarations.forEach((el) =>
    {
        if (el.date[el.date.length - 1].toISOString().substring(0, 10) === date.substring(0, 10)) 
        {
            newDeclarations.push(el)
        }
    })
    newDeclarations.slice(0, doclimit)

    return newDeclarations;
}

async function limitFilter(query, date, declarations, doclimit)
{
    let newDeclarations = [];
    const queryDeclarations = await Declaration.find({
        $and: [
            { _id: { $nin: declarations } },
            { title: { $regex: query, $options: "i" } }
        ]
    }).sort({ _id: -1 })
    queryDeclarations.forEach((el) =>
    {
        if (el.date[el.date.length - 1].toISOString().substring(0, 10) === date.substring(0, 10)) 
        {
            newDeclarations.push(el)
        }
    })
    newDeclarations.slice(0, doclimit)

    return newDeclarations;
}

async function allDateCount(date)
{
    return await Declaration.aggregate([
        { $addFields: { last: { $substr: [{ $last: "$date" }, 0, 10] } } },
        { $match: { last: date.substring(0, 10) } },
        { $count: "count" }
    ])
}

async function allQueryCount(query)
{
    return await Declaration.count({ title: { $regex: query, $options: "i" } })
}

async function limitFilterCount(date, query)
{
    return await Declaration.aggregate([
        { $addFields: { last: { $substr: [{ $last: "$date" }, 0, 10] } } },
        { $match: { last: date.substring(0, 10) } },
        { $match: { title: { $regex: query, $options: 'i' } } },
        { $count: "count" }
    ])
}

module.exports =
{
    getUser, limitNan, limitFilter, 
    allDateCount, allQueryCount, limitFilterCount, 
    limitQuery, limitDate, getUserdata, verifyToken
}
