const User = require("../../models/user");
const Token = require("../../models/token")

async function getUserdata(req, res)
{
    if (req.session.passport)
    {
        return await User.findOne({ username: req.session.passport.user }, {
            username: 1, email: 1,
            status: 1, date: 1,
            profile: 1, location: 1,
            bio: 1, bookmarks: 1,
            connections: 1, notifications: 1
        })
    }
    return undefined
}

function existsAdmin(req, res)
{
    if (req.session.passport)
    {
        return req.session.passport.user === "admin";
    }
    return false
}

module.exports = { getUserdata, existsAdmin }