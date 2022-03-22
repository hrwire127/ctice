const ServerError = require('../utils/ServerError');
const Joi = require("joi");
const { cloud } = require('../cloud/storage');
let streamifier = require('streamifier');

async function validateDbData(req, res, next) 
{
    console.log(`{validate \n${req.body}\n`)
    const declarationSchema = Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        file: Joi.string()
    })

    const { error } = declarationSchema.validate(req.body)

    console.log(`${error}}\n `)

    if (error)
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

