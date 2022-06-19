const UserError = require('../general/UserError');

function tryAsync_SR(func)
{
    return function (req, res, next)
    {
        req.type = 0
        func(req, res, next).catch(err => next(err))
    }
}

function tryAsync_CS(func)
{
    return function (req, res, next)
    {
        req.type = 1
        func(req, res, next).catch(err => next(err))
    }
}

function apiSecret(req, res, next)
{
    if (req.body.secret !== process.env.NEXT_PUBLIC_SECRET)
    {
        new UserError(...Object.values(errorMessages.didNotWork)).throw_CS(res)
    }
    next()
}

module.exports = {
    tryAsync_CS, tryAsync_SR, apiSecret,
}