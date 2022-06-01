const mongoose = require("mongoose")
const Declaration = require("../../models/declaration");
const { switchSort, sortByScore } = require('./_p_basic')

async function limitNan(declarations, doclimit, sort)
{
    let newDeclarations;
    await switchSort(sort, async () =>
    {
        newDeclarations = await Declaration.find({ _id: { $nin: declarations }, status: "Active" }).sort({ _id: -1 }).limit(doclimit);
    }, async () =>
    {
        newDeclarations = sortByScore(await Declaration.find({ _id: { $nin: declarations }, status: "Active" }))
        newDeclarations.splice(doclimit, newDeclarations.length)
    })
    return newDeclarations;
}
async function limitQuery(query, declarations, doclimit, sort)
{
    let queryDeclarations = [];
    await switchSort(sort, async () =>
    {
        queryDeclarations = await Declaration.find({
            $and: [
                { _id: { $nin: declarations.map(el => mongoose.Types.ObjectId(el._id)) } },
                { title: { $regex: query, $options: "i" } },
                { status: "Active" }
            ]
        }).sort({ _id: -1 }).limit(doclimit)
    }, async () =>
    {
        queryDeclarations = sortByScore(await Declaration.find({
            $and: [
                { _id: { $nin: declarations.map(el => mongoose.Types.ObjectId(el._id)) } },
                { title: { $regex: query, $options: "i" } },
                { status: "Active" }
            ]
        }).limit(doclimit))
    })
    return queryDeclarations;
}

async function limitDate(date, declarations, doclimit, sort)
{
    let newDeclarations = [];
    await switchSort(sort, async () =>
    {
        newDeclarations = await Declaration.aggregate([
            { $addFields: { last: { $substr: [{ $last: "$date" }, 0, 10] } } },
            { $match: { last: date.substring(0, 10) } },
            { $match: { _id: { $nin: declarations.map(el => mongoose.Types.ObjectId(el._id)) } } },
            { $match: { status: "Active" } },
            { $sort: { _id: -1 } },
            { $limit: doclimit },
        ])
    }, async () =>
    {
        newDeclarations = await Declaration.aggregate([
            { $match: { _id: { $nin: declarations.map(el => mongoose.Types.ObjectId(el._id)) } } },
            { $addFields: { last: { $substr: [{ $last: "$date" }, 0, 10] } } },
            { $match: { last: date.substring(0, 10) } },
            { $match: { status: "Active" } },
            { $limit: doclimit },
        ])
    })

    return newDeclarations;
}

async function limitFilter(query, date, declarations, doclimit, sort)
{
    let newDeclarations = [];
    await switchSort(sort, async () =>
    {
        newDeclarations = sortByScore(await Declaration.aggregate([
            { $match: { _id: { $nin: declarations.map(el => mongoose.Types.ObjectId(el._id)) } } },
            { $match: { title: { $regex: query, $options: 'i' } } },
            { $addFields: { last: { $substr: [{ $last: "$date" }, 0, 10] } } },
            { $match: { last: date.substring(0, 10) } },
            { $match: { status: "Active" } },
            { $sort: { _id: -1 } },
            { $limit: doclimit },
        ]))
    }, async () =>
    {
        newDeclarations = sortByScore(await Declaration.aggregate([
            { $match: { _id: { $nin: declarations.map(el => mongoose.Types.ObjectId(el._id)) } } },
            { $match: { title: { $regex: query, $options: 'i' } } },
            { $addFields: { last: { $substr: [{ $last: "$date" }, 0, 10] } } },
            { $match: { last: date.substring(0, 10) } },
            { $match: { status: "Active" } },
            { $limit: doclimit },
        ]))
    })

    return newDeclarations;
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

module.exports =
{
    limitNan, limitFilter, getDeclrScoreSort,
    limitQuery, limitDate, getDeclrDateSort,
}
