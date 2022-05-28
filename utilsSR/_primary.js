const { Redirects_SR } = require('./SR_Redirects');
const Declaration = require("../models/declaration");
const User = require("../models/user");
const Token = require("../models/token")
const userError = require('./userError');

async function getUserdata(req, res)
{
    if (req.session.passport)
    {
        return await User.findOne({ username: req.session.passport.user }, { username: 1, email: 1, status: 1, date: 1, profile: 1 })
    }
    else
    {
        return undefined
    }
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
async function limitNan(declarations, doclimit, sort)
{
    if (sort === 10)
    {
        return await Declaration.find({ _id: { $nin: declarations } }).sort({ _id: -1 }).limit(doclimit);
    }
    else
    {
        let newDeclarations = await Declaration.find({ _id: { $nin: declarations } })
        newDeclarations
            .sort((a, b) => (a.likes.filter(el => el.typeOf === true).length - a.likes.filter(el => el.typeOf === false).length
                < b.likes.filter(el => el.typeOf === true).length - b.likes.filter(el => el.typeOf === false).length)
                ? 1
                : ((b.likes.filter(el => el.typeOf === true).length - b.likes.filter(el => el.typeOf === false).length
                    < a.likes.filter(el => el.typeOf === true).length - a.likes.filter(el => el.typeOf === false).length)
                    ? -1 : 0))
        newDeclarations.splice(doclimit, newDeclarations.length)
        return newDeclarations;
    }
}
async function limitQuery(query, declarations, doclimit, sort)
{
    let queryDeclarations = [];
    if (sort === 10)
    {
        queryDeclarations = await Declaration.find({
            $and: [
                { _id: { $nin: declarations } },
                { title: { $regex: query, $options: "i" } }
            ]
        }).sort({ _id: -1 }).limit(doclimit)
        queryDeclarations.splice(doclimit, queryDeclarations.length)
    }
    else
    {
        queryDeclarations = await Declaration.find({
            $and: [
                { _id: { $nin: declarations } },
                { title: { $regex: query, $options: "i" } }
            ]
        })
        queryDeclarations
            .sort((a, b) => (a.likes.filter(el => el.typeOf === true).length - a.likes.filter(el => el.typeOf === false).length
                < b.likes.filter(el => el.typeOf === true).length - b.likes.filter(el => el.typeOf === false).length)
                ? 1
                : ((b.likes.filter(el => el.typeOf === true).length - b.likes.filter(el => el.typeOf === false).length
                    < a.likes.filter(el => el.typeOf === true).length - a.likes.filter(el => el.typeOf === false).length)
                    ? -1 : 0))
        queryDeclarations.splice(doclimit, queryDeclarations.length)
    }

    return queryDeclarations;
}

async function limitDate(date, declarations, doclimit, sort)
{
    let newDeclarations = [];
    if (sort === 10)
    {
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
        newDeclarations.splice(doclimit, newDeclarations.length)
    }
    else
    {
        const queryDeclarations = await Declaration.find({
            _id: { $nin: declarations }
        })
        queryDeclarations
            .sort((a, b) => (a.likes.filter(el => el.typeOf === true).length - a.likes.filter(el => el.typeOf === false).length
                < b.likes.filter(el => el.typeOf === true).length - b.likes.filter(el => el.typeOf === false).length)
                ? 1
                : ((b.likes.filter(el => el.typeOf === true).length - b.likes.filter(el => el.typeOf === false).length
                    < a.likes.filter(el => el.typeOf === true).length - a.likes.filter(el => el.typeOf === false).length)
                    ? -1 : 0))
        queryDeclarations.forEach((el) =>
        {
            if (el.date[el.date.length - 1].toISOString().substring(0, 10) === date.substring(0, 10)) 
            {
                newDeclarations.push(el)
            }
        })
        newDeclarations.splice(doclimit, newDeclarations.length)
    }

    return newDeclarations;
}

async function limitFilter(query, date, declarations, doclimit, sort)
{
    let newDeclarations = [];
    if (sort === 10)
    {
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
        
        newDeclarations.splice(doclimit, newDeclarations.length)
    }
    else
    {
        const queryDeclarations = await Declaration.find({
            $and: [
                { _id: { $nin: declarations } },
                { title: { $regex: query, $options: "i" } }
            ]
        })
        queryDeclarations
            .sort((a, b) => (a.likes.filter(el => el.typeOf === true).length - a.likes.filter(el => el.typeOf === false).length
                < b.likes.filter(el => el.typeOf === true).length - b.likes.filter(el => el.typeOf === false).length)
                ? 1
                : ((b.likes.filter(el => el.typeOf === true).length - b.likes.filter(el => el.typeOf === false).length
                    < a.likes.filter(el => el.typeOf === true).length - a.likes.filter(el => el.typeOf === false).length)
                    ? -1 : 0))
        queryDeclarations.forEach((el) =>
        {
            if (el.date[el.date.length - 1].toISOString().substring(0, 10) === date.substring(0, 10)) 
            {
                newDeclarations.push(el)
            }
        })
        newDeclarations.splice(doclimit, newDeclarations.length)
    }

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
