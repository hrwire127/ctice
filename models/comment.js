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
    let { content, date } = req.body;

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

    if (await new excRule([content, date], [comment, declaration], async () =>
    {
        Obj.date = date
        Obj.author = await User.findOne({ username: req.session.passport.user })
    }).Try()) return Obj;

    if (await new excRule([content, date, comment, declaration], [], async () =>
    {
        Obj.date = comment.date
        Obj.date.push(new Date(date))
        Obj.author = comment.author

    }).Try()) return Obj;


}


module.exports = mongoose.model('Comment', CommentSchema)