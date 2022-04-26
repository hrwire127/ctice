const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const { Rules } = require('../utilsSR/val-Rule')
const { inspectDecrl, inspectUser, modifyDesc } = require('../utilsSR/_secondary')

const DeclarationSchema = new Schema({
    title: {
        type: String,
        max: Rules.title_max_char,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    file:
    {
        name: {
            type: String,
            max: Rules.file_max_name
        },
        url: {
            type: String
        },
        location: {
            type: String
        }
    },
    date: {
        type: [String],
        required: true
    },
    author: {
        type: String,
        required: true
    }
});

DeclarationSchema.virtual('hasFile').get(function ()
{
    return this.file['url'] !== undefined;
})

DeclarationSchema.pre('save', function (next)
{
    this.set({ title: this.title.trim() });
    next();
})


module.exports = mongoose.model('Declaration', DeclarationSchema)