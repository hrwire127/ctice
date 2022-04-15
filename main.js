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

const User = require('./models/user');
const userError = require("./utils/userError");
const Redirects = require('./utils/Redirects');
const sessionConfig = require('./config/session.config')

const fileupload = require("express-fileupload");
const session = require('express-session');
const passport = require("passport")
const flash = require("flash")
const LocalStrategy = require("passport-local");



app.prepare().then(() =>
{
    const server = express();

    server.use(express.urlencoded({ extended: true }));
    server.use(express.static(path.join(__dirname, 'assets')));
    server.use(session(sessionConfig));
    server.use(flash())
    server.use(fileupload())
    server.use(express.json());
    server.use(cors());

    server.use(passport.initialize())
    server.use(passport.session())

    passport.use(new LocalStrategy(User.authenticate()))

    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

    server.use('/', index)
    server.use('/view', view)
    server.use('/edit', edit)
    server.use('/user', user)

    server.get('/*', function (req, res, next)
    {
        req.session.flash = [];
        next();
    });

    server.use((err, req, res, next) =>
    {
        console.log("AA")
        console.log(err)
        const error = new userError(err.message, err.status)
        req.session.error = error;
        Redirects.Error.CS(res)
    })
 
    server.get("/error", (req, res, next) =>
    {
        let error = req.session.error
        if (!error) error = new userError();
        res.status(error.status)
        app.render(req, res, "/error", { error })
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