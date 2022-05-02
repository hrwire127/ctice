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

CommentSchema.statics.processObj = async function (req) 
{
    let { content, date, author } = req.body;

    let Obj = { content, date }

    Obj.author = await User.findOne({ username: req.session.passport.user })

    return Obj;

}


module.exports = mongoose.model('Comment', CommentSchema)