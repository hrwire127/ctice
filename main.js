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

const ServerError = require("./utils/ServerError");
const { handleError } = require('./utils/middlewares');
const upload = require('./cloud/storage');

app.prepare().then(() =>
{
    const server = express();

    server.use(express.urlencoded({ extended: true }));
    server.use(express.static(path.join(__dirname, 'assets')));
    server.use(express.json());
    server.use(cors());

    server.use('/', index)
    server.use('/view', view)
    server.use('/edit', edit)

    server.use((err, req, res, next) =>
    {
        console.log("AA")
        const error = new ServerError(err.message, err.status)
        res.status(error.status).send(error.message)
        app.render(req, res, "/error", { error }) //?????
    }) //move to middleware

    // server.use(handleError(app))

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
