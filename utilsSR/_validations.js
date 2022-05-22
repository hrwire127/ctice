const Joi = require("joi").extend(require('@joi/date'));;
const userError = require('./userError');
const { inspectDecrl, inspectUser, modifyDesc, inspectComment, inspectChange } = require('./_secondary')

async function validateDeclr(req, res, next) 
{
    let { title, description, file } = req.body

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
        file: Joi.string()
    })

    const preparedBody =
    {
        title, description: JSON.parse(description), file
    }

    const { error } = declarationSchema.validate(preparedBody)

    if (error) 
    {
        console.log(error)
        const msg = error.details.map(e => e.message).join(',')
        return new userError(msg, 401).throw_CS(res)
    }


    const bodyError = inspectDecrl(title, JSON.parse(description), req.files)

    if (bodyError) 
    {
        return new userError(bodyError, 401).throw_CS(res)
    }

    req.body.title = title.trim()
    req.body.description = JSON.stringify(modifyDesc(JSON.parse(description)))
    // req.body.author = getUser(req, res)

    next()
}

async function validatePending(req, res, next) 
{
    let { confirmationCode, password, profile } = req.body

    const declarationSchema = Joi.object({
        confirmationCode: Joi.string().required(),
        password: Joi.string().required(),
        profile: Joi.string().required(),
    })

    const preparedBody =
    {
        confirmationCode, password, profile
    }

    const { error } = declarationSchema.validate(preparedBody)

    if (error) 
    {
        console.log(error)
        const msg = error.details.map(e => e.message).join(',')
        return new userError(msg, 401).throw_CS(res)
    }


    const bodyError = inspectUser(undefined, undefined, password, req.files)

    if (bodyError) 
    {
        return new userError(bodyError, 401).throw_CS(res)
    }

    req.body.password = password.trim()

    next()
}

async function validateRegUser(req, res, next) 
{
    const { username, email } = req.body;
    const userSchema = Joi.object({
        username: Joi.string().required(),
        email: Joi.string().required()
    })

    const { error } = userSchema.validate({ username, email })

    if (error) 
    {
        console.log(error)
        const msg = error.details.map(e => e.message).join(',')
        return new userError(msg, 401).throw_CS(res)
    }

    const bodyError = inspectUser(username, email)

    if (bodyError) 
    {
        return new userError(bodyError, 401).throw_CS(res)
    }

    req.body.username = username.trim()
    req.body.email = email.trim()

    next()

}

async function validateLogUser(req, res, next) 
{
    const { username, password, remember } = req.body;

    const userSchema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
        remember: Joi.boolean().required()
    })

    const { error } = userSchema.validate({ username, password, remember })

    if (error) 
    {
        console.log(error)
        const msg = error.details.map(e => e.message).join(',')
        return new userError(msg, 401).throw_CS(res)
    }

    const bodyError = inspectUser(username, undefined, password)

    if (bodyError) 
    {
        return new userError(bodyError, 401).throw_CS(res)
    }

    req.body.username = username.trim()
    req.body.password = password.trim()

    next()

}

async function validateChange(req, res, next)
{
    let { username, profile } = req.body
    console.log(req.body)

    const declarationSchema = Joi.object({
        username: Joi.string().allow(''),
        profile: Joi.string()
    })

    const preparedBody =
    {
        username, profile
    }

    const { error } = declarationSchema.validate(preparedBody)

    if (error) 
    {
        console.log(error)
        const msg = error.details.map(e => e.message).join(',')
        return new userError(msg, 401).throw_CS(res)
    }


    const bodyError = inspectChange(username, req.files)

    if (bodyError) 
    {
        return new userError(bodyError, 401).throw_CS(res)
    }

    req.body.username = username.trim()

    next()
}

async function validateComment(req, res, next)
{
    let { content, date } = req.body

    const commentSchema = Joi.object({
        content: Joi.object({
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
        date: Joi.date().iso()
    })

    const preparedBody =
    {
        content: JSON.parse(content)
    }

    const { error } = commentSchema.validate(preparedBody)

    if (error) 
    {
        console.log(error)
        const msg = error.details.map(e => e.message).join(',')
        return new userError(msg, 401).throw_CS(res)
    }


    const bodyError = inspectComment(JSON.parse(content))

    if (bodyError) 
    {
        return new userError(bodyError, 401).throw_CS(res)
    }

    req.body.content = JSON.stringify(modifyDesc(JSON.parse(content)))

    next()
}

async function validateApiQuery(req, res, next) 
{
    const { query } = req.body;

    if (query === undefined || query === null) return Redirects_SR.Api.sendApi(res, [])

    next()
}

async function validateApiDate(req, res, next) 
{
    const { date } = req.body;

    if (!date) return Redirects_SR.Api.sendApi(res, [])

    next()
}


module.exports = {

    validateDeclr, validateRegUser,
    validateLogUser, validateChange, 
    validatePending, validateComment,
    validateApiQuery, validateApiDate, 
}