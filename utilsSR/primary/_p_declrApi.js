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
                { _id: { $nin: declarations } },
                { title: { $regex: query, $options: "i" } },
                { status: "Active" }
            ]
        }).sort({ _id: -1 }).limit(doclimit)
        queryDeclarations.splice(doclimit, queryDeclarations.length)
    }, async () =>
    {
        queryDeclarations = sortByScore(await Declaration.find({
            $and: [
                { _id: { $nin: declarations } },
                { title: { $regex: query, $options: "i" } },
                { status: "Active" }
            ]
        }))
        queryDeclarations.splice(doclimit, queryDeclarations.length)
    })
    return queryDeclarations;
}

async function limitDate(date, declarations, doclimit, sort)
{
    let newDeclarations = [];
    await switchSort(sort, async () =>
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
    }, async () =>
    {
        const queryDeclarations = sortByScore(await Declaration.find({
            _id: { $nin: declarations },
            status: "Active"
        }))
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
    allDateCount, allQueryCount, limitFilterCount,
    limitQuery, limitDate, getDeclrDateSort,
}
