const { Redirects_SR } = require('./SR_Redirects');
const Declaration = require("../models/declaration");
const Comment = require("../models/comment");
const Reply = require("../models/reply")
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

function isAdmin(req, res)
{
    if (req.session.passport)
    {
        const session = req.session.passport
        return session.user === "admin";
    }
    else
    {
        return false
    }
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
        return await Declaration.find({ _id: { $nin: declarations }, status: "Active" }).sort({ _id: -1 }).limit(doclimit);
    }
    else
    {
        let newDeclarations = await Declaration.find({ _id: { $nin: declarations }, status: "Active" })
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
                { title: { $regex: query, $options: "i" } },
                { status: "Active" }
            ]
        }).sort({ _id: -1 }).limit(doclimit)
        queryDeclarations.splice(doclimit, queryDeclarations.length)
    }
    else
    {
        queryDeclarations = await Declaration.find({
            $and: [
                { _id: { $nin: declarations } },
                { title: { $regex: query, $options: "i" } },
                { status: "Active" }
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
            _id: { $nin: declarations },
            status: "Active"
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
            _id: { $nin: declarations },
            status: "Active"
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
    await switchSort(sort, async () =>
    {
        const queryDeclarations = await Declaration.find({
            $and: [
                { _id: { $nin: declarations } },
                { title: { $regex: query, $options: "i" } },
                { status: "Active" }
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
    }, async () =>
    {
        const queryDeclarations = await Declaration.find({
            $and: [
                { _id: { $nin: declarations } },
                { title: { $regex: query, $options: "i" } },
                { status: "Active" }
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
    })

    return newDeclarations;
}

async function allDateCount(date)
{
    return await Declaration.aggregate([
        { $addFields: { last: { $substr: [{ $last: "$date" }, 0, 10] } } },
        { $match: { last: date.substring(0, 10) } },
        { $match: { status: "Active" } },
        { $count: "count" }
    ])
}

async function allQueryCount(query)
{
    return await Declaration.count({ title: { $regex: query, $options: "i" }, status: "Active" })
}

async function limitFilterCount(date, query)
{
    return await Declaration.aggregate([
        { $addFields: { last: { $substr: [{ $last: "$date" }, 0, 10] } } },
        { $match: { last: date.substring(0, 10) } },
        { $match: { title: { $regex: query, $options: 'i' } } },
        { $match: { status: "Active" } },
        { $count: "count" }
    ])
}

async function switchSort(sort, dateFunc, scoreSort)
{
    if (sort === 10)
    {
        return dateFunc()
    }
    else if (sort === 20)
    {
        return scoreSort()
    }
}

function sortByScore(declarations)
{
    return declarations.sort((a, b) => (a.likes.filter(el => el.typeOf === true).length - a.likes.filter(el => el.typeOf === false).length
        < b.likes.filter(el => el.typeOf === true).length - b.likes.filter(el => el.typeOf === false).length)
        ? 1
        : ((b.likes.filter(el => el.typeOf === true).length - b.likes.filter(el => el.typeOf === false).length
            < a.likes.filter(el => el.typeOf === true).length - a.likes.filter(el => el.typeOf === false).length)
            ? -1 : 0))
}

async function getDeclrDateSort(id, length, status = false)
{
    if (status)
    {
        return await Declaration.findOne({ _id: id })
            .populate({
                path: 'comments',
                populate: {
                    path: 'author'
                },
                options: {
                    limit: process.env.COMMENTS_LOAD_LIMIT,
                    sort: { _id: -1 },
                    skip: length,
                }
            })
    }
    else
    {
        return await Declaration.findOne({ _id: id, status: "Active" })
            .populate({
                path: 'comments',
                populate: {
                    path: 'author'
                },
                match: { status: "Active" },
                options: {
                    limit: process.env.COMMENTS_LOAD_LIMIT,
                    sort: { _id: -1 },
                    skip: length,
                }
            })
    }
}

async function getDeclrScoreSort(id, status = false)
{
    if (status)
    {
        return await Declaration.findOne({ _id: id })
            .populate({
                path: 'comments',
                populate: {
                    path: 'author'
                },
            })
    }
    else
    {
        return await Declaration.findOne({ _id: id, status: "Active" })
            .populate({
                path: 'comments',
                populate: {
                    path: 'author'
                },
                match: { status: "Active" },
            })
    }
}

async function getCommentDateSort(id, length, status = false)
{
    if (status)
    {
        return await Comment.findOne({ _id: id })
            .populate({
                path: 'replies',
                populate: {
                    path: 'author'
                },
                options: {
                    limit: process.env.COMMENTS_LOAD_LIMIT,
                    sort: { _id: -1 },
                    skip: length,
                }
            })
    }
    else
    {
        return await Comment.findOne({ _id: id, status: "Active" })
            .populate({
                path: 'replies',
                populate: {
                    path: 'author'
                },
                match: { status: "Active" },
                options: {
                    limit: process.env.COMMENTS_LOAD_LIMIT,
                    sort: { _id: -1 },
                    skip: length,
                }
            })
    }
}


module.exports =
{
    getUser, limitNan, limitFilter,
    allDateCount, allQueryCount, limitFilterCount,
    limitQuery, limitDate, getUserdata, verifyToken,
    switchSort, sortByScore, isAdmin, getDeclrDateSort,
    getDeclrScoreSort, getCommentDateSort
}
