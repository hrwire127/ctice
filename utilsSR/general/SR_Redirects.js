class SR_Redirect
{
    constructor(redirect)
    {
        this.redirect = redirect;
    }
    sendApi(res, obj)
    {
        res.json({ obj })
    }
    sendError(res, error)
    {
        res.json({ error })
    }
    CS(res)
    {
        res.json({ redirect: this.redirect })
    }
    SR(res)
    {
        res.redirect(this.redirect)
    }
    customCS(res, redirect)
    {
        res.json({ redirect })
    }
    customSR(res, redirect)
    {
        res.redirect(redirect)
    }
}

const Redirects_SR = {
    Home: new SR_Redirect("/"),
    Login: new SR_Redirect("/user/login"),
    Api: new SR_Redirect(),
}


module.exports = Redirects_SR;