class userError extends Error
{
    constructor(message = "Something went wrong", status = 500)
    {
        super()
        this.message = message;
        this.status = status;
    }
    throwServer(req, res)
    {
        req.session.error = { message: this.message, status: this.status };
        res.redirect('/error')
    }
}

module.exports = userError;