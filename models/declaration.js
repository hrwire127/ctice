const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const Rules = require('../utilsSR/rules/validRules')
const { excRule } = require('../utilsSR/helpers/exc-Rule');
const { upload_pdf, upload_desc } = require('../utilsSR/primary/_p_basic')
const { cloud } = require('../cloud/storage');
const User = require("./user");
const Tag = require("./tag");
const { getUserdata } = require('../utilsSR/primary/_p_user')

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
    }, { _id: false })],
    status: {
        type: String,
        required: true,
        enum: ['Disabled', 'Active'],
        default: 'Active'
    },
    tags: [{
        type: Schema.Types.ObjectId,
        ref: "Tag",
        required: true
    }]
});


DeclarationSchema.virtual('hasFile').get(function ()
{
    return this.file['url'] !== undefined;
})

DeclarationSchema.statics.processObj = async function (req, res, declaration = undefined, del = false) 
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

    Obj.tags = JSON.parse(req.body.tags)

    const pdf_file = files ? files.file : null

    if (declaration)
    {
        const descriptionObj = JSON.parse(Obj.description)
        const descriptionDeclr = JSON.parse(declaration.description)


        if (files)
        {
            await new Promise(async (resolve, reject) =>
            {
                for (let key in files)
                {
                    if (key !== "file")
                    {
                        const file = files[key]
                        let { url } = await upload_desc(file.data, res)
                        for (const secKey in descriptionObj.entityMap)
                        {
                            const e = descriptionObj.entityMap[secKey];
                            if (e.data.src === key)
                            {
                                descriptionObj.entityMap[secKey].data.src = url
                            }
                        }
                    }
                }
                resolve()
            })
            Obj.description = JSON.stringify(descriptionObj)
        }

        const oldFiles = Object.keys({ ...descriptionDeclr.entityMap }).map((key) => descriptionDeclr.entityMap[key].data.src)
        const newFiles = Object.keys({ ...descriptionObj.entityMap }).map((key) => descriptionObj.entityMap[key].data.src)

        await new Promise((resolve, reject) =>
        {
            oldFiles.every(async (f) => 
            {
                if (newFiles.includes(f))
                {
                    return true
                }
                else if (f.includes("ctice"))
                {
                    const url = []
                    for (let char of f.slice(f.indexOf("ctice"), f.length))
                    {
                        if (char === ".") break
                        url.push(char)
                    }
                    await cloud.destroy(
                        url.join('')
                    )
                }
            })
            resolve()
        })
    }
    else if (files)
    {
        const descriptionObj = JSON.parse(Obj.description)
        await new Promise(async (resolve, reject) =>
        {
            for (let key in files)
            {
                if (key !== "file")
                {
                    const file = files[key]
                    let { url } = await upload_desc(file.data, res)
                    for (const secKey in descriptionObj.entityMap)
                    {
                        const e = descriptionObj.entityMap[secKey];
                        if (e.data.src === key)
                        {
                            descriptionObj.entityMap[secKey].data.src = url
                        }
                    }
                }
            }
            resolve()
        })
        Obj.description = JSON.stringify(descriptionObj)
    }

    if (await new excRule([body.file, pdf_file, hadFile], [], async () => //regular hadfile
    {
        //modified file
        let file = await upload_pdf(files.file, res)
        await cloud.destroy(
            declaration.file.location,
        )
        Obj.file = {
            name: files.file.name,
            url: file.url,
            location: file.location
        }
    }).Try()) return Obj;

    if (await new excRule([body.file, pdf_file], [hadFile], async () =>
    {
        //added file
        let file = await upload_pdf(files.file, res)
        Obj.file = {
            name: files.file.name,
            url: file.url,
            location: file.location
        }
    }).Try()) return Obj;

    if (await new excRule([], [body.file, pdf_file, hadFile], async () =>
    {
        //did not had and will not
    }).Try()) return Obj;

    if (await new excRule([hadFile], [body.file, pdf_file,], async () =>
    {
        //had but got deleted
        await cloud.destroy(
            declaration.file.location,
        )
        declaration.file = undefined
        await declaration.save();
    }).Try()) return Obj;

    if (await new excRule([body.file, hadFile], [pdf_file], async () =>
    {
        //had but wasn't modified
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

DeclarationSchema.methods.processNotifLike = async function (req, res) 
{
    const declr = await this.populate({ path: 'authors' })
    const userdata = await getUserdata(req, res)

    const raw = `<div style="padding: 4px; borderBottom: 1px solid">
    <h5>${userdata.username} liked your comment</h5></div>`

    const Obj = {
        raw, date: new Date(), banner: null
    }

    await User.attachNotification(Obj, declr.authors[declr.authors.length - 1], false)
}

const Declaration = mongoose.model('Declaration', DeclarationSchema);

module.exports = Declaration;