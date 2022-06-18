const mongoose = require("mongoose")
const Declaration = require("../../models/declaration");
const { switchSort, sortByScore } = require('./_p_basic')

async function getDeclrDateSort(id, length, admin = false, doclimit)
{
    const findPip = admin ? { _id: id } : { _id: id, status: "Active" }
    const populatePip = {
        path: 'comments',
        populate: {
            path: 'author'
        }
    }
    if (admin) populatePip.match = { status: "Active" }
    populatePip.options = {
        doclimit,
        sort: { _id: -1 },
        skip: length,
    }
    return await Declaration.findOne(findPip).populate(populatePip)
}

async function getDeclrScoreSort(id, admin = false, doclimit)
{
    const findPip = admin ? { _id: id } : { _id: id, status: "Active" }
    const populatePip = {
        path: 'comments',
        populate: {
            path: 'author'
        },
    }
    if (admin) populatePip.match = { status: "Active" }
    const declaration = await Declaration.findOne(findPip).populate(populatePip);
    declaration.comments = sortByScore(declaration.comments
        .splice(0, comments.length)
        .splice(doclimit, declaration.comments.length))
    return declaration;
}

module.exports =
{
    getDeclrScoreSort, getDeclrDateSort
}
