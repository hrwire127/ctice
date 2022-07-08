const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const { excRule } = require('../utilsSR/helpers/exc-Rule');
const User = require("./user");
const { cutMention } = require('../utilsSR/primary/_p_basic');
const { getUserdata } = require('../utilsSR/primary/_p_user')

const ReplySchema = new Schema({
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
    status: {
        type: String,
        required: true,
        enum: ['Disabled', 'Active'],
        default: 'Active'
    },
});

ReplySchema.statics.processObj = async function (req, res, comment = undefined, reply = undefined, del = false) 
{
    let { content } = req.body;

    let Obj = { content }

    if (del)
    {
        await new excRule([], [], async () =>
        {
            let author = await User.findOne({ username: req.session.passport.user })
            return comment.replies.forEach((c, i) =>
            {
                if (c === reply._id && author._id === reply._id)
                {
                    return i;
                }
            });
        }, true).Try();
    }

    if (await new excRule([content], [reply, comment], async () =>
    {
        Obj.date = new Date();
        Obj.author = await User.findOne({ username: req.session.passport.user })
    }).Try()) return Obj;

    if (await new excRule([content, reply, comment], [], async () =>
    {
        Obj.date = reply.date
        Obj.date.push(new Date())
        Obj.author = reply.author

    }).Try()) return Obj;
}

ReplySchema.methods.tryLike = async function (userId, type)
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

ReplySchema.methods.processNotifReply = async function (req, res) 
{
    let username = cutMention(JSON.parse(this.content))
    let reply = await this.populate({ path: 'author' })
    const userdata = await getUserdata(req, res)

    const Mention = {
        raw: `<div style="padding: 4px; borderBottom: 1px solid">
        <h5>${userdata.username} @ mentioned you</h5></div>`, date: new Date(), banner: null
    }

    const Reply = {
        raw: `<div style="padding: 4px; borderBottom: 1px solid">
        <h5>${userdata.username} replied on your post</h5></div>`, date: new Date(), banner: null
    }

    if (username) await User.attachNotification(Mention, await User.findOne({ username }), false)
    await User.attachNotification(Reply, reply.author, false)
}

ReplySchema.methods.processNotifLike = async function (req, res) 
{
    const reply = await this.populate({ path: 'author' })
    const userdata = await getUserdata(req, res)

    const raw = `<div style="padding: 4px; borderBottom: 1px solid">
    <h5>${userdata.username} liked your reply</h5></div>`

    const Obj = {
        raw, date: new Date(), banner: null
    }

    await User.attachNotification(Obj, reply.author, false)
}

const Reply = mongoose.model('Reply', ReplySchema);

module.exports = Reply;