const dev = process.env.NODE_ENV !== 'production'
if (dev)
{
    require('dotenv').config()
}

const { DB_DEV_URL, NEXT_PUBLIC_DR_PORT, NEXT_PUBLIC_DB_PORT, DB_PRODUCTION_URL, NEXT_PUBLIC_SECRET } = process.env;

const next = require('next')
const express = require('express')
const app = next({ dev })
const handle = app.getRequestHandler()
const mongoose = require('mongoose');

const dburl = !dev ? process.env.DB_PRODUCTION_URL : DB_DEV_URL

const path = require('path');
const cors = require('cors');

mongoose.connect(dburl, {
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
const UserError = require("./utilsSR/general/userError");
const Redirects_SR = require('./utilsSR/general/SR_Redirects');
const errorMessages = require('./utilsSR/rules/errorMessages')
const { v4: uuidv4 } = require('uuid');

const fileupload = require("express-fileupload");
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const passport = require("passport")
const flash = require("flash")
const LocalStrategy = require("passport-local");
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require("helmet")

const cspoption = {
    directives: {
        'default-src': ["'self' https://res.cloudinary.com"],
        'script-src': [(req, res) => `data: gap: https://ssl.gstatic.com https://res.cloudinary.com 'nonce-${res.locals.nonce}' 'strict-dynamic' ${dev ? "'unsafe-eval'" : ''}`],
        "style-src": ["'self' https://fonts.googleapis.com https://res.cloudinary.com 'unsafe-inline' blob: data:"],
        "img-src": ["'self' http://res.cloudinary.com blob: data:"],
        "media-src": ["*"],
        "connect-src": ["'self' http://res.cloudinary.com api.mapbox.com blob:"]
    },
}
//data: gap: https://ssl.gstatic.com 'unsafe-eval'; style-src 'self' 'unsafe-inline'; media-src *"
var store = new MongoDBStore({
    uri: dburl,
    collection: 'sessions',
    secret: NEXT_PUBLIC_SECRET,
    touchAfter: 24 * 3600
});

store.on("error", function (err) 
{
    console.log(err)
})

const sessionConfig = {
    name: "_s",
    secret: NEXT_PUBLIC_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        // secure: true, https
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
    store
}

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

    server.use(passport.initialize())
    server.use(passport.session())

    passport.use(new LocalStrategy(User.authenticate()))

    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

    server.use((req, res, next) =>
    {
        res.locals.nonce = uuidv4()
        helmet.contentSecurityPolicy(cspoption)(req, res, next)
    })

    server.use('/', index)
    server.use('/view', view)
    server.use('/edit', edit)
    server.use('/user', user)
    server.use('/admin', admin)

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

    const port = !dev ? process.env.PORT : NEXT_PUBLIC_DR_PORT

    server.listen(port, e =>
    {
        if (e) throw e;
        console.log(`server started ${port}`)
    })
})