class SR_Redirect
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
    Home: new SR_Redirect("Home", "/"),
    Error: new SR_Redirect("Error", "/error"),
    Login: new SR_Redirect("Login", "/user/login"),
    Api: new SR_Redirect("Api"),
}

module.exports = Redirects_SR;