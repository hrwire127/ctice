class userError extends Error
{
    constructor(message = "Something went wrong", status = 500)
    {
        super()
        this.message = message;
        this.status = status;
    }
    throw_SR(req, res)
    {
        req.session.error = { message: this.message, status: this.status };
        res.redirect('/error')
    }
    throw_CS(res) 
    {
        res.json(
            {
                err: {
                    message: this.message,
                    status: this.status
                }
            })
    }
}

module.exports = userError;