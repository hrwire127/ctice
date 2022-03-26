const ServerError = require('../utils/ServerError');
const Joi = require("joi");
const { cloud } = require('../cloud/storage');
let streamifier = require('streamifier');
const rules = require('./rules');

function validateBody(title, description, file)
{
    return (
        title.length > rules.title_max_char ||
            description.blocks.length > rules.desc_max_blocks ||
            file.size > rules.file_max_size ? true : false
    )
}

async function validateDbData(req, res, next) 
{
    console.log(req.body)
    const { title, description } = req.body
    console.log(req.files.file)
    const declarationSchema = Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        file: Joi.string()
    })

    const { error } = declarationSchema.validate(req.body)
    const bodyError = validateBody(title, JSON.parse(description), req.files.file)
    console.log(bodyError)

    if (error || bodyError)
    {
        const msg = error.details.map(e => e.message).join(',')
        next(new ServerError("Invalid Data", 400))
    }
    else
    {
        next()
    }
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

module.exports = { validateDbData, handleError, StorageUpload }

