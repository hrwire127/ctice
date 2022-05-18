const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const { excRule } = require('../utilsSR/exc-Rule');
const User = require("./user");

const CommentSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    date: {
        type: [Date],
        required: true
    },
});

CommentSchema.statics.processObj = async function (req, declaration = undefined, comment = undefined, del = false) 
{
    let { content } = req.body;

    let Obj = { content }

    if (del)
    {
        await new excRule([], [], async () =>
        {
            let author = await User.findOne({ username: req.session.passport.user })
            return declaration.comments.forEach((c, i) =>
            {
                if (c === comment._id && author._id === comment._id)
                {
                    console.log(i)
                    return i;
                }
            });
        }, true).Try();
    }

    if (await new excRule([content], [comment, declaration], async () =>
    {
        Obj.date = new Date();
        Obj.author = await User.findOne({ username: req.session.passport.user })
    }).Try()) return Obj;

    if (await new excRule([content, comment, declaration], [], async () =>
    {
        Obj.date = comment.date
        Obj.date.push(new Date())
        Obj.author = comment.author

    }).Try()) return Obj;


}

const Comment = mongoose.model('Comment', CommentSchema);
module.exports = Comment;