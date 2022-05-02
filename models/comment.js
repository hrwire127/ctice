const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const { Rules } = require('../utilsSR/val-Rule')
const { excRule } = require('../utilsSR/exc-Rule');
const { upload } = require('../utilsSR/_tertiary')
const { cloud } = require('../cloud/storage');
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
    let { content, date, author } = req.body;

    let Obj = { content, date }

    if (del)
    {
        await new excRule([], [], async () =>
        {
            declaration.comments.forEach(c, i =>
            {
                if (c === comment._id)
                {
                    declaration.comments.splice(i, 1);
                }
            });
        }, true).Try();
        return;
    }

    console.log(content)
    console.log(date)
    console.log(author)
    console.log(comment)
    console.log(declaration)

    if (await new excRule([content, date], [comment, declaration], async () =>
    {
        Obj.author = comment.author
        Obj.date.push(comment.date)
        console.log(Obj)
    }).Try()) return Obj;

    if (await new excRule([content, date], [], async () =>
    {
        Obj.author = await User.findOne({ username: req.session.passport.user })
    }).Try()) return Obj;

}


module.exports = mongoose.model('Comment', CommentSchema)