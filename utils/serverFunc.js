const ServerError = require('./ServerError');
const { cloud } = require('../cloud/storage');
let streamifier = require('streamifier');
const { ClientRule, Rules } = require('./clientRules');
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
    const titleRule = new ClientRule(title.length, Rules.title_max_char, 0)
    if (titleRule.getVal()) return titleRule.processMsg()

    const descRule = new ClientRule(description.blocks.length, Rules.desc_max_blocks, 0)
    if (descRule.getVal()) return descRule.processMsg()

    if (newFile)
    {
        const fileRule = new ClientRule(newFile.size, Rules.file_max_size, 0)
        if (fileRule.getVal()) return fileRule.processMsg()

        const fileFormat =  new ClientRule(newFile.mimetype, Rules.file_format, 3)
        if (fileFormat.getVal()) return fileFormat.processMsg()

    }

    const dateRule = new ClientRule(date.length, Rules.date_length, 0) //3
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

module.exports = { validateDbData, handleError, StorageUpload, tryAsync, ValidateSecret }

