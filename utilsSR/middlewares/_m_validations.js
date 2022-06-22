const Joi = require("joi").extend(require('@joi/date'));
const UserError = require('../general/UserError');
const { inspectDecrl, inspectUser, inspectComment, inspectChange, inspectGallery, inspectTag } = require('../primary/_p_inspect')
const { modifyDesc } = require('../primary/_p_basic')

async function validateDeclr(req, res, next) 
{
    let { title, description, file, tags } = req.body

    console.log(req.body)
    console.log(req.files)

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
        tags: Joi.array().items(Joi.any().required())
    })

    const preparedBody =
    {
        title, description: JSON.parse(description), file, tags: JSON.parse(tags)
    }

    const { error } = declarationSchema.validate(preparedBody)

    if (error) 
    {
        console.log(error)
        const msg = error.details.map(e => e.message).join(',')
        throw new UserError(msg, 401).throw_CS(res)
    }


    const bodyError = inspectDecrl(title, JSON.parse(description), req.files, JSON.parse(tags))

    if (bodyError) 
    {
        throw new UserError(bodyError, 401).throw_CS(res)
    }

    req.body.title = title.trim()
    req.body.description = JSON.stringify(modifyDesc(JSON.parse(description)))
    next()
}

async function validateRegUser(req, res, next) 
{
    let { confirmationCode, password, profile, location, bio, facebook, linkedin, twitter } = req.body

    const declarationSchema = Joi.object({
        confirmationCode: Joi.string().required(),
        password: Joi.string().required(),
        profile: Joi.string(),
        location: Joi.object({
            name: Joi.string().required(),
            lat: Joi.number().required(),
            long: Joi.number().required()
        }),
        bio: Joi.object({
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
        }),
        connections: Joi.object({
            facebook: Joi.string().allow(''),
            linkedin: Joi.string().allow(''),
            twitter: Joi.string().allow('')
        })
    })

    const preparedBody =
    {
        confirmationCode,
        password,
        profile,
        location: location ? JSON.parse(location) : undefined,
        bio: JSON.parse(bio),
        connections: { facebook, linkedin, twitter }
    }

    const { error } = declarationSchema.validate(preparedBody)

    if (error) 
    {
        console.log(error)
        const msg = error.details.map(e => e.message).join(',')
        throw new UserError(msg, 401).throw_CS(res)
    }


    const userError = inspectUser(undefined, undefined, password, req.files)
    const bodyError = inspectChange(undefined, undefined,
        location ? JSON.parse(location) : undefined,
        JSON.parse(bio),
        { facebook, linkedin, twitter })

    if (userError) 
    {
        throw new UserError(bodyError, 401).throw_CS(res)
    }

    if (bodyError) 
    {
        return new UserError(bodyError, 401).throw_CS(res)
    }

    req.body.password = password.trim()
    if (req.body.bio) req.body.bio = JSON.stringify(modifyDesc(JSON.parse(bio)))


    next()
}

async function validatePendingUser(req, res, next) 
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
        throw new UserError(msg, 401).throw_CS(res)
    }

    const bodyError = inspectUser(username, email)

    if (bodyError) 
    {
        throw new UserError(bodyError, 401).throw_CS(res)
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
        throw new UserError(msg, 401).throw_CS(res)
    }

    const bodyError = inspectUser(username, undefined, password)

    if (bodyError) 
    {
        throw new UserError(bodyError, 401).throw_CS(res)
    }

    req.body.username = username.trim()
    req.body.password = password.trim()

    next()

}

async function validateChange(req, res, next)
{
    let { username, profile, location, bio, facebook, linkedin, twitter } = req.body

    const declarationSchema = Joi.object({
        username: Joi.string(),
        profile: Joi.string(),
        location: Joi.object({
            name: Joi.string().required(),
            lat: Joi.number().required(),
            long: Joi.number().required()
        }),
        bio: Joi.object({
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
        }),
        connections: Joi.object({
            facebook: Joi.string().allow(''),
            linkedin: Joi.string().allow(''),
            twitter: Joi.string().allow('')
        })
    })

    const preparedBody =
    {
        username,
        profile,
        location: location ? JSON.parse(location) : undefined,
        bio: bio ? JSON.parse(bio) : undefined,
        connections: { facebook, linkedin, twitter }
    }

    const { error } = declarationSchema.validate(preparedBody)

    if (error) 
    {
        console.log(error)
        const msg = error.details.map(e => e.message).join(',')
         throw new UserError(msg, 401).throw_CS(res)
    }

    const bodyError = inspectChange(username,
        req.files,
        location ? JSON.parse(location) : undefined,
        bio ? JSON.parse(bio) : undefined,
        { facebook, linkedin, twitter })

    if (bodyError) 
    {
         throw new UserError(bodyError, 401).throw_CS(res)
    }

    if (req.body.username) req.body.username = username.trim()
    if (req.body.bio) req.body.bio = JSON.stringify(modifyDesc(JSON.parse(bio)))

    next()
}

async function validateComment(req, res, next)
{
    let { content } = req.body

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
        throw new UserError(msg, 401).throw_CS(res)
    }


    const bodyError = inspectComment(JSON.parse(content))

    if (bodyError) 
    {
        throw new UserError(bodyError, 401).throw_CS(res)
    }

    req.body.content = JSON.stringify(modifyDesc(JSON.parse(content)))

    next()
}

async function validateGallery(req, res, next)
{
    const declarationSchema = Joi.array().items(
        Joi.object().keys({
            name: Joi.string().required(),
            data: Joi.any().required(),
            size: Joi.number().required(),
            encoding: Joi.string().required(),
            tempFilePath: Joi.string().required(),
            truncated: Joi.boolean().required(),
            mimetype: Joi.string().required(),
            md5: Joi.string().required(),
            mv: Joi.function().required()
        }))

    const { error } = declarationSchema.validate(req.files ? Array.from(req.files) : undefined)

    if (error) 
    {
        console.log(error)
        const msg = error.details.map(e => e.message).join(',')
        return new UserError(msg, 401).throw_CS(res)
    }
    next()
}

async function validateBanner(req, res, next)
{
    const declarationSchema = Joi.object({
        content: Joi.string().required(),
        date: Joi.date().iso()
    })

    const { error } = declarationSchema.validate(req.body)

    if (error) 
    {
        console.log(error)
        const msg = error.details.map(e => e.message).join(',')
        throw new UserError(msg, 401).throw_CS(res)
    }

    next()
}

async function validateNotification(req, res, next)
{
    const notificationSchema = Joi.object({
        content: Joi.string().required(),
        banner: Joi.string(),
        date: Joi.date().iso()
    })

    const { error } = notificationSchema.validate(req.body)

    if (error) 
    {
        console.log(error)
        const msg = error.details.map(e => e.message).join(',')
        throw new UserError(msg, 401).throw_CS(res)
    }

    next()
}

async function validateTag(req, res, next)
{
    console.log(req.body)

    const tagSchema = Joi.object({
        content: Joi.string().required(),
    })

    const { error } = tagSchema.validate(req.body)

    if (error) 
    {
        console.log(error)
        const msg = error.details.map(e => e.message).join(',')
        throw new UserError(msg, 401).throw_CS(res)
    }

    const bodyError = inspectTag(req.body.content)

    if (bodyError) 
    {
        throw new UserError(bodyError, 401).throw_CS(res)
    }

    req.body.content = req.body.content.trim()

    next()
}

module.exports = {

    validateDeclr, validatePendingUser,
    validateLogUser, validateChange,
    validateRegUser, validateComment,
    validateGallery, validateBanner,
    validateNotification, validateTag
}