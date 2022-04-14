class Redirect
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
    Client: new Redirect("Client", "/"), 
    Error: new Redirect("Error", "/error"),
    Auth: new Redirect("Auth", "/user/login"),
    Api: new Redirect("Api"),
}

module.exports = Redircets;