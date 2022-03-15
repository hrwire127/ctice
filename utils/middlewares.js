const ServerError = require('../utils/ServerError');
const Joi = require("joi");

async function validateDbData(req, res, next) 
{
    console.log(`validate \n${req.body} \n`)
    const declarationSchema = Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        file: Joi.object()
    })

    // const title = req.body.get("title")
    // const description = req.body.get("description");
    // const file = req.body.get("file");


    const { error } = declarationSchema.validate(
        // {
        //     title: req.body.title,
        //     description: JSON.parse(req.body.description),
        //     file: JSON.parse(req.body.file),
        // }
        // {
        //     title,
        //     description,
        //     file
        // }
        req.body
    )



    // res.status(400).send("Invalid Data");
    // throw new ServerError("Invalid Data", 400)
    console.log(error)

    if (error)
    {
        const msg = error.details.map(e => e.message).join(',') //
        // if (req.files.file) 
        // res.status(400).send("Invalid Data")
        next(new ServerError("Invalid Data", 400))
        // throw new ServerError("Invalid Data", 400)
    }
    else
    {
        // if (req.body.file) 
        // {
        //     console.log("valid")
        //     res.status(200).send("Valid Data")
        // }
        // else
        // {
        //     console.log("next")
        //     next()
        // }
        res.status(200).send("Valid Data")
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

module.exports = { validateDbData, handleError }

