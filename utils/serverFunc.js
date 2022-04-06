const ServerError = require('./ServerError');
const { cloud } = require('../cloud/storage');
let streamifier = require('streamifier');
const { BodyRule, Rules } = require('./validationRules');
const { ProcessRule } = require('../utils/processRules');
const Joi = require("joi");

function modifyDesc(description)
{
    let newDesc = description;
    for (var i = newDesc.blocks.length - 1; i > 0; i--)
    {
        if (newDesc.blocks[i].text === "")
        {
            newDesc.blocks = newDesc.blocks.slice(0, i);
        }
        else 
        {
            break;
        }
    }
    let last = newDesc.blocks.length - 1;
    for (var i = newDesc.blocks[last].text.length - 1; i > 0; i--)
    {
        if (newDesc.blocks[last].text[i] === " ")
        {
            newDesc.blocks[last].text = newDesc.blocks[last].text.slice(0, i);
        }
        else 
        {
            break;
        }
    }
    return newDesc
}
function validateBody(title, description, newFile, date)
{
    const titleRule = new BodyRule(title.length, Rules.title_max_char, 0)
    if (titleRule.getVal()) return titleRule.processMsg()

    const descRule = new BodyRule(description.blocks.length, Rules.desc_max_blocks, 0)
    if (descRule.getVal()) return descRule.processMsg()

    if (newFile)
    {
        const fileRule = new BodyRule(newFile.size, Rules.file_max_size, 0)
        if (fileRule.getVal()) return fileRule.processMsg()

        const fileFormat = new BodyRule(newFile.mimetype, Rules.file_format, 3)
        if (fileFormat.getVal()) return fileFormat.processMsg()

    }

    const dateRule = new BodyRule(date.length, Rules.date_length, 0)
    if (dateRule.getVal()) return dateRule.processMsg()
}

async function validateDbData(req, res, next) 
{
    let { title, description, date, file } = req.body
    const declarationSchema = Joi.object({
        title: Joi.string().required(),
        description: Joi.object({
            blocks: Joi.array().items(Joi.object().keys({
                key: Joi.string().required(),
                text: Joi.string().required().allow(''),
                type: Joi.string().required(),
                depth: Joi.number().required(),
                inlineStyleRanges: Joi.array().required(),
                entityRanges: Joi.array().required(),
                data: Joi.object().required()
            })),
            entityMap: Joi.object().required()
        }).required(),
        file: Joi.string(),
        date: Joi.string().required()
    })

    const preparedBody =
    {
        title, description: JSON.parse(description), file, date
    }

    const { error } = declarationSchema.validate(preparedBody)

    if (error) 
    {
        const msg = error.details.map(e => e.message).join(',')
        next(new ServerError(msg, 400))
    }

    newFile = req.files ? req.files.file : undefined;

    const bodyError = validateBody(title, JSON.parse(description), newFile, date)

    if (bodyError) next(new ServerError(bodyError, 400))

    req.body.title = title.trim()
    req.body.description = JSON.stringify(modifyDesc(JSON.parse(description)))
    next()

}

function handleError(app)
{
    return function (err, req, res, next)
    {
        const error = new ServerError(err.message, err.status)
        res.status(error.status)
        app.render(req, res, "/error", { error })
    }
}


const StorageUpload = async (file) =>
{
    const res = await new Promise((resolve, reject) =>
    {
        let cld_upload_stream = cloud.upload_stream(
            {
                folder: process.env.CLOUD_FOLDER
            },
            function (err, res)
            {
                if (res)
                {
                    resolve(res);
                } else
                {
                    reject(err);
                }
            }
        );

        streamifier.createReadStream(file.data).pipe(cld_upload_stream);
    });
    return {
        url: res.url,
        location: res.public_id
    }
}

function tryAsync(func)
{
    return function (req, res, next)
    {
        func(req, res, next).catch(e => next(e))
    }
}

function ValidateSecret(key, callback)
{
    if (key === process.env.NEXT_PUBLIC_SECRET)
    {
        callback()
    }
    else
    {
        throw new ServerError("UnAuthorized", 401)
    }
}

async function processData(body = undefined, files = undefined, declaration = undefined, optional = false)
{
    const hadFile = declaration ? declaration['file']['url'] !== undefined : undefined;

    let Obj = {
        ...body
    }

    console.log(optional)

    if (optional)
    {
        await new ProcessRule([], [], async () =>
        {
            console.log("66")
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

    let q = await new ProcessRule([body.file, files, hadFile], [], async () =>
    {
        console.log("11")
        let file = await StorageUpload(files.file)
        await cloud.destroy(
            declaration.file.location,
        )
        Obj.file = {
            name: files.file.name,
            url: file.url,
            location: file.location
        }
    }).Try();
    console.log(q)
    if (q) return Obj;

    let w = await new ProcessRule([body.file, files], [hadFile], async () =>
    {
        console.log("22")
        let file = await StorageUpload(files.file)
        Obj.file = {
            name: files.file.name,
            url: file.url,
            location: file.location
        }
    }).Try();
    console.log(w)
    if (w) return Obj;

    let e = await new ProcessRule([], [body.file, files, hadFile], async () =>
    {
        console.log("33")

    }).Try();
    console.log(e)
    if (e) return Obj;

    let r = await new ProcessRule([hadFile], [body.file, files,], async () =>
    {
        console.log("44")
        await cloud.destroy(
            declaration.file.location,
        )
        declaration.file = undefined
        await declaration.save();
    }).Try();
    console.log(r)
    if (r) return Obj;

    let t = await new ProcessRule([body.file, hadFile], [files], async () =>
    {
        console.log("55")
        Obj.file = declaration.file;
    }).Try()
    console.log(t)
    if (t) return Obj;

}

module.exports = { validateDbData, handleError, StorageUpload, tryAsync, ValidateSecret, processData }

