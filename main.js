const dev = process.env.NODE_ENV !== 'production'
if (dev)
{
    require('dotenv').config()
}


const { NEXT_PUBLIC_DB_HOST, NEXT_PUBLIC_DR_PORT, NEXT_PUBLIC_DB_PORT } = process.env;

const next = require('next')
const express = require('express')
const app = next({ dev })
const handle = app.getRequestHandler()
const mongoose = require('mongoose');

const path = require('path');
const cors = require('cors');

mongoose.connect(NEXT_PUBLIC_DB_HOST, {
    useNewUrlParser: true
})
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () =>
{
    console.log(`connected to db ${NEXT_PUBLIC_DB_PORT}`);
});

module.exports = {
    app
}

const index = require("./routes/index")
const view = require("./routes/view")
const edit = require("./routes/edit")
const user = require("./routes/user")
const admin = require("./routes/admin")

const User = require('./models/user');
const UserError = require("./utilsSR/general/UserError");
const Redirects_SR = require('./utilsSR/general/SR_Redirects');
const sessionConfig = require('./config/session.config')
const errorMessages = require('./utilsSR/rules/errorMessages')
const { v4: uuidv4 } = require('uuid');

const fileupload = require("express-fileupload");
const session = require('express-session');
const passport = require("passport")
const flash = require("flash")
const LocalStrategy = require("passport-local");
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require("helmet")

app.prepare().then(() =>
{
    const server = express();

    server.use(express.urlencoded({ extended: true }))
    server.use(express.static(path.join(__dirname, 'assets')))
    server.use(session(sessionConfig))
    server.use(flash())
    server.use(fileupload())
    server.use(express.json())
    server.use(cors())
    server.use(mongoSanitize())
    server.use(helmet({ contentSecurityPolicy: false }))

    // const scriptUrls = [
    // ]
    // const styleUrls = [
    //     "https://api.mapbox.com/",
    //     "https://api.tiles.mapbox.com/",
    //     "https://font.googleapis.com/"
    // ]
    // const connectUrls = [
    //     "https://api.mapbox.com/",
    //     "https://a.tiles.mapbox.com/",
    //     "https://b.tiles.mapbox.com/",
    //     "https://events.mapbox.com/",
    // ]

    // const fontUrls = []

    // server.use(helmet.contentSecurityPolicy({
    //     directives: {
    //         defaultSrc: [],
    //         connectSrc: ["'self'", ...connectUrls],
    //         scriptSrc: ["'unsafe-inline'", "'self'",
    //             ...scriptUrls],
    //         styleSrc: ["'self'", "'unsafe-inline'", ...styleUrls],
    //         workerSrc: ["'self'", "blob:"],
    //         objectSrc: [],
    //         imgSrc: [
    //             "'self'",
    //             "blob:",
    //             "data:",
    //             `https://res.cloudinary.com/${process.env.CLOUD_NAME}/image/upload/v1654542329/ctice`
    //         ],
    //         fontSrc: ["'self'", ...fontUrls]
    //     }
    // }))

    server.use(passport.initialize())
    server.use(passport.session())

    passport.use(new LocalStrategy(User.authenticate()))

    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

    server.use('/', index)
    server.use('/view', view)
    server.use('/edit', edit)
    server.use('/user', user)
    server.use('/admin', admin)

    const options = {
        directives: {
            'default-src': ["'self'"],
            'script-src': [(req, res) => `'nonce-${res.locals.nonce}' 'strict-dynamic'`],
        },
    }

    server.use((req, res, next) =>
    {
        res.locals.nonce = uuidv4()
        helmet.contentSecurityPolicy(options)(req, res, next)
    })

    server.get('/*', function (req, res, next)
    {
        req.session.flash = [];
        next();
    });

    server.use((err, req, res, next) =>
    {
        console.log("AA")
        console.log(err)

        console.log(req.type)

        const error = dev ? new UserError(err.message, err.status)
            : new UserError(undefined, err.status).generateMessage()


        console.log(error)

        if (req.type === 0) app.render(req, res, "/", { error })
        else Redirects_SR.Api.sendError(res, error)
    })

    server.get("*", (req, res, next) =>
    {
        return handle(req, res)
    })

    server.listen(NEXT_PUBLIC_DR_PORT, e =>
    {
        if (e) throw e;
        console.log(`server started ${NEXT_PUBLIC_DR_PORT}`)
    })
})