const Comment = require("../../models/comment");

async function getCommentDateSort(id, length, admin = false)
{
    const findPip = admin ? { _id: id } : { _id: id, status: "Active" }
    const populatePip = {
        path: 'replies',
        populate: {
            path: 'author'
        },
    }
    if (admin) populatePip.match = { status: "Active" }
    populatePip.options = {
        limit: process.env.COMMENTS_LOAD_LIMIT,
        sort: { _id: -1 },
        skip: length,
    }
    return await Comment.findOne(findPip).populate(populatePip)
}

module.exports = { getCommentDateSort }