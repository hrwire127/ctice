const codes = require("../../seeds/errorCodes")
const { app } = require("../../main");

class UserError extends Error
{
    constructor(message = "Something went wrong", status = 500)
    {
        super()
        this.message = message;
        this.status = status;
    }
    generateMessage()
    {
        codes.forEach(c =>
        {
            if (c.status === this.status) this.message = c.message
        })
        if (!this.message) this.message = "Something went wrong"

        return this
    }
    // setup(req)
    // {
    //     req.session.error = { message: this.message, status: this.status }
    // }
    throw_CS(res) 
    {
        res.json(
            {
                error: {
                    message: this.message,
                    status: this.status
                }
            })
    }
    throw_SR(req, res) 
    {
        app.render(req, res, "/", { error: this })
    }
}

module.exports = UserError;