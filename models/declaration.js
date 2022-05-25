const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const { Rules } = require('../utilsSR/val-Rule')
const { excRule } = require('../utilsSR/exc-Rule');
const { upload_pdf } = require('../utilsSR/_tertiary')
const { cloud } = require('../cloud/storage');
const User = require("./user");
const { Redirects_SR } = require('../utilsSR/SR_Redirects');

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
    },
    likes: [new Schema({
        typeOf: {
            type: Boolean,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
        }
        // type: [Schema.Types.ObjectId],
        // default: [],
        // ref: "Like",
        // required: true
    }, { _id: false })]
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
    Obj.date.push(new Date())

    Obj.authors = declaration ? declaration.authors : []
    Obj.authors.push(await User.findOne({ username: req.session.passport.user }))

    if (await new excRule([body.file, files, hadFile], [], async () => //regular hadfile
    {
        let file = await upload_pdf(files.file)
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
        let file = await upload_pdf(files.file)
        Obj.file = {
            name: files.file.name,
            url: file.url,
            location: file.location
        }
    }).Try()) return Obj;

    if (await new excRule([], [body.file, files, hadFile], async () =>
    {
    }).Try()) return Obj;

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

DeclarationSchema.methods.tryLike = async function (userId, type)
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

const Declaration = mongoose.model('Declaration', DeclarationSchema);

module.exports = Declaration;