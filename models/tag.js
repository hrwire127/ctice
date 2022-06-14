const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const UserError = require('../utilsSR/general/UserError');
const errorMessages = require("../utilsSR/rules/errorMessages")

const TagSchema = new Schema({
    content: {
        type: String,
        required: true,
        unique: true
    }
});

TagSchema.statics.processObj = async function (req, res)
{
    const { content } = req.body
    const Tag = mongoose.model('Tag', TagSchema);
    if (await Tag.findOne({ content }))
    {
        throw new UserError(...Object.values(errorMessages.tagExists)).throw_CS(res);
    }
    return { content }
}

const Tag = mongoose.model('Tag', TagSchema);

module.exports = Tag;