const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const { excRule } = require('../utilsSR/helpers/exc-Rule');
const User = require("./user");
const notifTemplates = require("../utilsSR/rules/notifTemplates");

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
    likes: [new Schema({
        typeOf: {
            type: Boolean,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
        }
    }, { _id: false })],
    replies: [{
        type: Schema.Types.ObjectId,
        ref: "Reply",
    }],
    status: {
        type: String,
        required: true,
        enum: ['Disabled', 'Active'],
        default: 'Active'
    },
});

CommentSchema.statics.processObj = async function (req, res, declaration = undefined, comment = undefined, del = false) 
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

CommentSchema.methods.processNotifComment = async function () 
{
    let username = []
    const content = JSON.parse(this.content)

    content.blocks.forEach(b =>
    {
        if (b.text.includes("@"))
        {
            let i = b.text.indexOf("@") + 1
            for (let c = "@"; c !== " "; i++)
            {
                username.push(b.text[i]);
                c = b.text[i + 1]
            }
            console.log(username)
            username = username.join("")
        }
    })
    console.log(username)

    const Obj = { content: notifTemplates.comment, date: new Date(), banner: null }

    await User.attachNotification(Obj, await User.findOne({ username }), false)
}

CommentSchema.methods.tryLike = async function (userId, type)
{
    const True = this.likes.filter(el => el.user.valueOf() === userId.valueOf() && el.typeOf === true).length;
    const False = this.likes.filter(el => el.user.valueOf() === userId.valueOf() && el.typeOf === false).length;
    if (type)
    {
        if (True <= 0) 
        {

            if (False > 0)
            {
                const i = this.likes.findIndex(el => el.user.valueOf() === userId.valueOf() && el.typeOf === false)
                this.likes.splice(i, 1);
            }
            const like = { user: userId, typeOf: true }
            this.likes.push(like);
        }
        else
        {
            const i = this.likes.findIndex(el => el.user.valueOf() === userId.valueOf() && el.typeOf === true)
            this.likes.splice(i, 1);
        }
    }
    else
    {
        if (False <= 0)
        {
            if (True > 0)
            {
                const i = this.likes.findIndex(el => el.user.valueOf() === userId.valueOf() && el.typeOf === true);
                this.likes.splice(i, 1);
            }
            const like = { user: userId, typeOf: false }
            this.likes.push(like);
        }
        else
        {
            const i = this.likes.findIndex(el => el.user.valueOf() === userId.valueOf() && el.typeOf === false)
            this.likes.splice(i, 1);
        }
    }
}

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;