const Redirects_SR = require('../general/SR_Redirects');
const UserError = require('../general/UserError');

function tryAsync_SR(func)
{
    return function (req, res, next)
    {
        func(req, res, next).catch(err =>
        {
            req.type = 0
            throw new UserError(err.message, err.status).throw_SR(req, res)
        })
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
        Redirects_SR.Error.CS(res)
    }
    next()
}

module.exports = {
    tryAsync_CS, tryAsync_SR, apiSecret, tryAsync_CS, 
}