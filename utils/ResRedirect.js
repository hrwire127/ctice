class ResSend
{
    constructor(type, redirect)
    {
        this.type = type;
        this.redirect = redirect;
    }
    send(res, obj)
    {
        res.json({ type: this.type, obj })
    }
    sendRes(res)
    {
        res.json({ type: this.type, redirect: this.redirect })
    }
    serverRes(res)
    {
        res.redirect(this.redirect)
    }
}

const Redircets = { 
    Client: new ResSend("Client", "/"), 
    Error: new ResSend("Error", "/error"),
    Auth: new ResSend("Auth", "/user/login"),
    Api: new ResSend("Api"),
}

module.exports = Redircets;