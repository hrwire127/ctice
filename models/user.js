const mongoose = require('mongoose')
const passportLocalMongoose = require("passport-local-mongoose")
const Schema = mongoose.Schema;
const UserError = require('../utilsSR/general/UserError');
const Rules = require('../utilsSR/rules/validRules')
const passport = require('passport');
const errorMessages = require("../utilsSR/rules/errorMessages")
const { upload_notification } = require('../utilsSR/primary/_p_basic')
const { upload_banner } = require('../utilsSR/primary/_p_basic')
const Banner = require('./banner')
const { excRule } = require('../utilsSR/helpers/exc-Rule');
const { upload_profiles, upload_galeries } = require('../utilsSR/primary/_p_basic')
const { cloud } = require('../cloud/storage');
const ValRules = require('../utilsSR/rules/validRules')
const nodemailer = require('../config/nodemailer')

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
        default: [new Date()],
        required: true
    },
    profile:
    {
        url: {
            default: process.env.NEXT_PUBLIC_DEF_PROFILE_URL_1,
            type: String,
            required: true,
        },
        location: {
            type: String,
        }
    },
    location:
    {
        name: {
            type: String,
        },
        lat: {
            type: Number,
        },
        long: {
            type: Number,
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
    },
    gallery: [new Schema({
        content: {
            type: String
        },
        location: {
            type: String
        },
        name: {
            type: String
        },
    }, { _id: false })],
    notifications: [new Schema({
        content: {
            type: String,
            default: null
        },
        banner:
        {
            content: {
                type: String,
                default: null
            },
            seen: {
                type: Boolean
            },
            raw: {
                type: String,
                default: null
            }
        },
        date: {
            type: [Date],
            required: true
        },
        seen: {
            type: Boolean,
            default: false,
            required: true
        },
        raw: {
            type: String,
            default: null
        }
    }, { _id: false })]
});

UserSchema.plugin(passportLocalMongoose);

UserSchema.statics.getSecured = function (users)
{
    delete users.hash;
    delete users.salt;
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
                throw new UserError(err.message, err.status);
            }
            else if (!user) 
            {
                throw new UserError(info.message, 404);
            }
            else
            {
                if (user.status !== "Active")
                {
                    throw new UserError(...Object.values(errorMessages.disabledUser));
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

UserSchema.statics.processRegister = async function (req, res, { pending, password })
{
    const { files, body } = req
    const { bio, location, facebook, linkedin, twitter } = body
    const User = mongoose.model('User', UserSchema)
    if (pending)
    {
        if (await User.findOne({ email: pending.email }))
        {
            throw new UserError(...Object.values(errorMessages.emailAllreadyUsed))
        }
        else if (await User.findOne({ username: pending.username }))
        {
            throw new UserError(...Object.values(errorMessages.usernameAllreadyUsed))
        }
        else
        {
            const file = files ? await upload_profiles(files.profile) : null

            const user = new User({
                username: pending.username,
                date: [pending.date],
                email: pending.email,
                status: "Active",
                profile: {
                    url: file ? file.url : undefined,
                    location: file ? file.location : undefined
                },
                bio,
                location,
                connections: { facebook, linkedin, twitter }
            })

            if (facebook) user.connections.facebook = facebook
            if (twitter) user.connections.twitter = twitter
            if (linkedin) user.connections.linkedin = linkedin

            await User.register(user, password)
        }
    }
    else
    {
        throw new UserError(...Object.values(errorMessages.noPending)).setup(req, res);
    }
}

UserSchema.statics.updateChanges = async function (req, res, user)
{
    const { username, profile, location, bio, facebook, linkedin, twitter } = req.body;

    const User = mongoose.model('User', UserSchema)

    if (await User.findOne({ username }))
    {
        throw new UserError(...Object.values(errorMessages.usernameAllreadyUsed))
    }
    else if (Math.abs(user.getDateDiffMS() < process.env.NEXT_PUBLIC_ACCOUNT_EDIT_DELAY))
    {
        throw new UserError(...Object.values(errorMessages.delayed))
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
        }

        if (location)
        {
            user.location = JSON.parse(location)
        }

        if (bio)
        {
            user.bio = bio
        }

        user.connections = {}

        if (facebook) user.connections.facebook = facebook
        if (twitter) user.connections.twitter = twitter
        if (linkedin) user.connections.linkedin = linkedin

        if (user.date.length >= ValRules.dates_length)
        {
            throw new UserError(...Object.values(errorMessages.tooManyEdits))
        }

        user.date.push(new Date())

        if (await new excRule([req.files, user.profile.location], [profile], async () =>
        {
            let file = await upload_profiles(req.files.profile)
            if (user.profile.location !== process.env.NEXT_PUBLIC_DEF_PROFILE_LOCATION)
            {
                await cloud.destroy(
                    user.profile.location
                )
            }
            user.profile.location = file.location
            user.profile.location = file.location
        }).Try()) return user;

        if (await new excRule([], [profile, req.files, user.profile.location], async () =>
        {
        }).Try()) return user;

        if (await new excRule([user.profile.location], [profile, req.files], async () =>
        {
            if (user.profile.location !== process.env.NEXT_PUBLIC_DEF_PROFILE_LOCATION)
            {
                await cloud.destroy(user.profile.location)
            }
            user.profile.url = process.env.NEXT_PUBLIC_DEF_PROFILE_URL_1
            // user.profile.location = process.env.NEXT_PUBLIC_DEF_PROFILE_LOCATION
        }).Try()) return user;

        return user;
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

UserSchema.methods.getDateDiffMS = function ()
{
    return new Date() - this.date[this.date.length - 1]
}

UserSchema.methods.processGalery = async function (files, res)
{
    if (files && Object.keys(files).length > process.env.NEXT_PUBLIC_EDITS_LENGTH)
    {
        throw new UserError(...Object.values(errorMessages.tooManyImages))
    }

    for (let o of this.gallery)
    {
        await cloud.destroy(
            o.content
        )
    }

    this.gallery = []

    if (files)
    {
        for (let f of Object.keys(files))
        {
            const file = await upload_galeries(files[f])
            this.gallery.push({ name: file.name, content: file.content })
        }
    }
}

UserSchema.statics.processNotification = async function (req, res, preset) 
{
    const { content, banner } = req.body
    if (preset) content = preset

    const notifbuf = Buffer.from(content, 'utf8');
    const { url } = await upload_notification(notifbuf)

    let Obj = { content: url, date: new Date() }

    if (banner && banner !== "")
    {
        const bannerbuf = Buffer.from(banner, 'utf8');
        const { url: bannerUrl } = await upload_banner(bannerbuf);
        Obj.banner = { content: bannerUrl, seen: false }
    }

    return Obj;
}

UserSchema.statics.attachNotification = async function (Obj, user, sendmail) 
{
    const User = mongoose.model('User', UserSchema)
    const users = user ? [user] : await User.find({})

    console.log(Obj)

    users.forEach(async u => 
    {
        u.notifications.push(Obj)

        await u.save()
        if (Obj.banner)
        {
            const content = await fetch(Obj.banner.content)
                .then(res => res.text())
                .then(res => res)

            if (sendmail) await nodemailer.sendNotification(content, u.email)
        }
    })
}

const User = mongoose.model('User', UserSchema);

module.exports = User;