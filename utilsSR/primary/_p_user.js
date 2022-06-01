const User = require("../../models/user");
const Token = require("../../models/token")

async function getUserdata(req, res)
{
    if (req.session.passport)
    {
        return await User.findOne({ username: req.session.passport.user }, { username: 1, email: 1, status: 1, date: 1, profile: 1, location: 1, bio: 1, bookmarks: 1, connections: 1 })
    }
    else
    {
        return undefined
    }
}

function existsAdmin(req, res)
{
    if (req.session.passport)
    {
        const session = req.session.passport
        return session.user === "admin";
    }
    else
    {
        return false
    }
}

function verifyToken(req, res)
{
    return new Promise((resolve, reject) =>
    {
        Token.findOne({
            token: req.params.confirmationCode,
        })
            .then(async (token) =>
            {
                resolve(token)
            })
            .catch((err) => 
            {
                new userError(err.message, err.status).throw_SR(req, res)
                reject(err)
            });
    })
}

module.exports = { getUserdata, existsAdmin, verifyToken }