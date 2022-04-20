class Redirect
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

const Redirects_SR = { 
    Home: new Redirect("Home", "/"), 
    Error: new Redirect("Error", "/error"),
    Login: new Redirect("Login", "/user/login"),
    Api: new Redirect("Api"),
}

module.exports = Redirects_SR;