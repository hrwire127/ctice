const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const { Rules } = require('../utilsSR/val-Rule')
const { excRule } = require('../utilsSR/exc-Rule');
const { upload } = require('../utilsSR/_tertiary')
const { cloud } = require('../cloud/storage');
const User = require("./user");

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
        type: [Date],
        required: true
    },
    authors: {
        type: [Schema.Types.ObjectId],
        ref: "User",
        required: true
    },
    comments: {
        type: [Schema.Types.ObjectId],
        ref: "Comment"
    }
});

DeclarationSchema.virtual('hasFile').get(function ()
{
    return this.file['url'] !== undefined;
})

DeclarationSchema.statics.processObj = async function (req, declaration = undefined, del = false) 
{
    let { body, files } = req;

    const hadFile = declaration ? declaration.hasFile : undefined;

    let Obj = {
        ...body
    }


    if (del)
    {
        await new excRule([], [], async () =>
        {
            if (declaration.file.location)
            {
                await cloud.destroy(
                    declaration.file.location,
                )
            }
        }, true).Try();
        return;
    }

    Obj.date = declaration ? declaration.date : []
    Obj.date.push(body.date)

    Obj.authors = []
    Obj.authors.push(await User.findOne({ username: req.session.passport.user }))

    if (await new excRule([body.file, files, hadFile], [], async () =>
    {
        let file = await upload(files.file)
        await cloud.destroy(
            declaration.file.location,
        )
        Obj.file = {
            name: files.file.name,
            url: file.url,
            location: file.location
        }
    }).Try()) return Obj;

    if (await new excRule([body.file, files], [hadFile], async () =>
    {
        let file = await upload(files.file)
        Obj.file = {
            name: files.file.name,
            url: file.url,
            location: file.location
        }
    }).Try()) return Obj;

    if (await new excRule([], [body.file, files, hadFile], async () =>
    { }).Try()) return Obj;

    if (await new excRule([hadFile], [body.file, files,], async () =>
    {
        await cloud.destroy(
            declaration.file.location,
        )
        declaration.file = undefined
        await declaration.save();
    }).Try()) return Obj;

    if (await new excRule([body.file, hadFile], [files], async () =>
    {
        Obj.file = declaration.file;
    }).Try()) return Obj;

}

module.exports = mongoose.model('Declaration', DeclarationSchema)