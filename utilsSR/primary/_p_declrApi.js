const mongoose = require("mongoose")
const Declaration = require("../../models/declaration");
const { switchSort, sortByScore } = require('./_p_basic')

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
    getDeclrScoreSort, getDeclrDateSort,
}
