const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const { excRule } = require('../utilsSR/helpers/exc-Rule');
const User = require("./user");
const { cutMention } = require('../utilsSR/primary/_p_basic');
const { getUserdata } = require('../utilsSR/primary/_p_user')

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

CommentSchema.methods.processNotifComment = async function (req, res) 
{
    let username = cutMention(JSON.parse(this.content))
    let comment = await this.populate({ path: 'author' })
    const userdata = await getUserdata(req, res)


    const Mention = {
        raw: `<h5>${userdata.username} @ mentioned you</h5>`, date: new Date(), banner: null
    }

    const Comment = {
        raw: `<h5>${userdata.username} commented on your post</h5>`, date: new Date(), banner: null
    }
    // const Comment = { content: process.env.NEXT_PUBLIC_NOTIF_COMMENT, date: new Date(), banner: null }
    // const Mention = { content: process.env.NEXT_PUBLIC_NOTIF_MENTION, date: new Date(), banner: null }

    if (username) await User.attachNotification(Mention, await User.findOne({ username }), false)
    await User.attachNotification(Comment, comment.author, false)
}

CommentSchema.methods.processNotifLike = async function (req, res) 
{
    const comment = await this.populate({ path: 'author' })
    const userdata = await getUserdata(req, res)

    const raw = `<h5>${userdata.username} liked your comment</h5>`

    const Obj = {
        // content : process.env.NEXT_PUBLIC_NOTIF_LIKE,
        raw, date: new Date(), banner: null
    }

    await User.attachNotification(Obj, comment.author, false)
}

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;