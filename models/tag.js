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
        throw new UserError(...Object.values(errorMessages.tagExists)).throw_CS(res)
    }
    return { content }
}

TagSchema.pre('remove', function (next)
{
    // Remove all the assignment docs that reference the removed person.
    this.model('Declaration').remove({ tags: { $in: this._id } }, next);
});

const Tag = mongoose.model('Tag', TagSchema);

module.exports = Tag;