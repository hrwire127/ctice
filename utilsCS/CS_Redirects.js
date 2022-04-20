class CS_Redirect
{
    constructor(type, redirect)
    {
        this.type = type;
        this.redirect = redirect;
    }
    sendObj(res, obj)
    {
        res.json({ type: this.type, obj })
    }
    CS(res)
    {
        res.json({ type: this.type, redirect: this.redirect })
    }
    SR(res)
    {
        res.redirect(this.redirect)
    }
}

const Redirects_CS = { 
    Home: new CS_Redirect("Home", "/"), 
    Error: new CS_Redirect("Error", "/error"),
    Login: new CS_Redirect("Login", "/user/login"),
    Api: new CS_Redirect("Api"),
}

module.exports = Redirects_CS;