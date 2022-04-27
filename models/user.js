const mongoose = require('mongoose')
const passportLocalMongoose = require("passport-local-mongoose")
const Schema = mongoose.Schema;
const userError = require('../utilsSR/userError');
const { Rules } = require('../utilsSR/val-Rule')
const passport = require('passport');
const errorMessages = require("../utilsSR/errorMessages")
const Pending = require("./pending")
const Redirects_SR = require('../utilsSR/SR_Redirects')


const UserSchema = new Schema({

    email: {
        type: String,
        required: true,
        max: Rules.email_max_char,
        unique: true
    },
    status: {
        type: String,
        required: true,
        enum: ['Disabled', 'Active'],
        default: 'Disabled'
    },
    confirmationCode: {
        type: String,
        unique: true
    },
    date:
    {
        type: String,
        max: Rules.date_length,
        required: true
    }
});

UserSchema.plugin(passportLocalMongoose);

UserSchema.statics.getSecured = function (users)
{
    delete users.hash;
    delete users.salt;
    delete users.confirmationCode;
    return users;
}

UserSchema.statics.processLogin = async function (req, res, next)
{
    return new Promise((resolve, reject) =>
    {
        passport.authenticate('local', function (err, user, info)
        {
            if (err)
            {
                new userError(err.message, err.status).throw_CS(res);
                reject()
            }
            else if (!user) 
            {
                new userError(info.message, 404).throw_CS(res);
                reject()
            }
            else
            {
                if (user.status !== "Active")
                {
                    new userError(...Object.values(errorMessages.disabledUser)).throw_CS(res);
                    reject()
                }
                const remember = JSON.parse(req.body.remember)
                req.login(user, function (error)
                {
                    if (error) res.json({ error });
                });
                if (remember)
                {
                    req.session.cookie.expires = false
                }
                else
                {
                    req.session.cookie.originalMaxAge = 24 * 60 * 60 * 1000 // Expires in 1 day
                }
                resolve()
            }
        })(req, res, next);
    })
}


UserSchema.methods.processRegister = async function (req, res, pending, { user, password })
{
    const User = mongoose.model('User')
    return new Promise(async (resolve, reject) =>
    {
        if (pending)
        {
            console.log(user)
            console.log(password)
            if (await User.findOne({ email: user.email }))
            {
                new userError(...Object.values(errorMessages.emailAllreadyUsed)).throw_CS(res)
                reject();
            }
            else if (await User.findOne({ username: user.username }))
            {
                new userError(...Object.values(errorMessages.usernameAllreadyUsed)).throw_CS(res)
                reject();
            }
            await User.register(user, password)
            resolve()
        }
        else
        {
            new userError(...Object.values(errorMessages.noPending)).setup(req, res);
            Redirects_SR.Error.CS(res)
            reject()
        }
    })
}

const User = mongoose.model('User', UserSchema);

module.exports = User