const mongoose = require('mongoose')
const passportLocalMongoose = require("passport-local-mongoose")
const Schema = mongoose.Schema;
const userError = require('../utilsSR/general/userError');
const Rules = require('../utilsSR/rules/validRules')
const passport = require('passport');
const errorMessages = require("../utilsSR/rules/errorMessages")
const Redirects_SR = require('../utilsSR/general/SR_Redirects')
const { excRule } = require('../utilsSR/helpers/exc-Rule');
const { upload_profiles } = require('../utilsSR/primary/_p_basic')
const { cloud } = require('../cloud/storage');


const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        max: Rules.username_max_char,
        unique: true
    },
    bio: {
        type: String,
        required: true
    },
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
    date:
    {
        type: [Date],
        default: new Date(),
        required: true
    },
    profile:
    {
        url: {
            default: process.env.NEXT_PUBLIC_DEF_PROFILE_URL,
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true,
        }
    },
    location:
    {
        name: {
            type: String,
            required: true,
        },
        lat: {
            type: Number,
            required: true,
        },
        long: {
            type: Number,
            required: true,
        }
    },
    bookmarks: {
        type: [Schema.Types.ObjectId],
        ref: "Declaration"
    },
    connections: {
        twitter: {
            type: "String",
        },
        facebook: {
            type: "String",
        },
        linkedin: {
            type: "String",
        },
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
        passport.authenticate('local', async function (err, user, info)
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

UserSchema.statics.processRegister = async function (req, res, token, { user, password })
{
    const User = mongoose.model('User', UserSchema)
    if (token)
    {
        if (await User.findOne({ email: user.email }))
        {
            new userError(...Object.values(errorMessages.emailAllreadyUsed)).throw_CS(res)
        }
        else if (await User.findOne({ username: user.username }))
        {
            new userError(...Object.values(errorMessages.usernameAllreadyUsed)).throw_CS(res)
        }
        else
        {
            const file = await upload_profiles(req.files.profile)
            console.log(file)
            user.profile.url = file.url
            user.profile.location = file.location
            console.log(user)
            await User.register(user, password)
        }
    }
    else
    {
        new userError(...Object.values(errorMessages.noPending)).setup(req, res);
        Redirects_SR.Error.CS(res)
    }
}

UserSchema.statics.updateChanges = async function (req, res, user)
{
    const { username, id, profile, location, bio, facebook, linkedin, twitter } = req.body;

    const User = mongoose.model('User', UserSchema)
    if (await User.findOne({ username: username }))
    {
        new userError(...Object.values(errorMessages.usernameAllreadyUsed)).throw_CS(res)
    }
    else
    {
        if (username && username !== "")
        {
            user.username = username
        }

        if (profile === user.profile.url)
        {
            user.file = user.file;
            return user;
        }

        if (location)
        {
            user.location = JSON.parse(location)
        }

        if (bio)
        {
            user.bio = JSON.parse(bio)
        }

        user.connections = {}

        if(facebook) user.connections.facebook = facebook
        if(twitter) user.connections.twitter = twitter
        if(linkedin) user.connections.linkedin = linkedin

        console.log(user)

        user.date.push(new Date())

        if (await new excRule([req.files, user.profile.url], [profile], async () =>
        {
            let file = await upload_profiles(req.files.profile)
            if (user.profile.location !== process.env.NEXT_PUBLIC_DEF_PROFILE_LOCATION)
            {
                await cloud.destroy(
                    user.profile.location
                )
            }
            user.profile.url = file.url
            user.profile.location = file.location
        }).Try()) return user;
        
        if (await new excRule([], [profile, req.files, user.profile.url], async () =>
        {
        }).Try()) return user;
        
        if (await new excRule([user.profile.url], [profile, req.files], async () =>
        {
            if (user.profile.location !== process.env.NEXT_PUBLIC_DEF_PROFILE_LOCATION)
            {
                await cloud.destroy(
                    user.profile.location, {}, (res, err) =>
                {
                }
                )
            }
            user.profile.url = process.env.NEXT_PUBLIC_DEF_PROFILE_URL
            user.profile.location = process.env.NEXT_PUBLIC_DEF_PROFILE_LOCATION
        }).Try()) return user;
    }
}

UserSchema.methods.tryBoookmark = function (declaration)
{
    if (this.bookmarks.includes(declaration._id))
    {
        this.bookmarks.splice(this.bookmarks.indexOf(declaration._id), 1)
    }
    else
    {
        this.bookmarks.push(declaration)
    }
}

const User = mongoose.model('User', UserSchema);

module.exports = User;