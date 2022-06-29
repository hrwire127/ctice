const UserError = require('../general/userError');
const {
    declarationSchema, reguserSchema, pendingSchema, loguserSchema, changeSchema,
    commentSchema, gallerySchema, bannerSchema, notificationSchema, tagSchema
} = require("../joi/schemas")
const { inspectDecrl, inspectUser, inspectComment, inspectChange, inspectGallery, inspectTag } = require('../primary/_p_inspect')
const { modifyDesc } = require('../primary/_p_basic')

async function validateDeclr(req, res, next) 
{
    let { title, description, file, tags } = req.body

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
    const preparedBody =
    {
        confirmationCode,
        password,
        profile,
        location: location ? JSON.parse(location) : undefined,
        bio: JSON.parse(bio),
        connections: { facebook, linkedin, twitter }
    }

    const { error } = reguserSchema.validate(preparedBody)

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

    const { error } = pendingSchema.validate({ username, email })

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

    const { error } = loguserSchema.validate({ username, password, remember })

    console.log(error)

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

    const preparedBody =
    {
        username,
        profile,
        location: location ? JSON.parse(location) : undefined,
        bio: bio ? JSON.parse(bio) : undefined,
        connections: { facebook, linkedin, twitter }
    }

    const { error } = changeSchema.validate(preparedBody)

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
    const { error } = gallerySchema.validate(req.files ? Array.from(req.files) : undefined)

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
    const { error } = bannerSchema.validate(req.body)

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