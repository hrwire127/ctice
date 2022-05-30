const Comment = require("../../models/comment");

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

module.exports = { getCommentDateSort }