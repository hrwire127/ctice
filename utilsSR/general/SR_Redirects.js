const { Api_Call, Def_Call } = require('../rules/apiCalls')

class SR_Redirect
{
    constructor(redirect)
    {
        this.redirect = redirect;
    }
    sendApi(res, obj)
    {
        const type = Api_Call
        res.json({ type, obj })
    }
    sendError(res, error)
    {
        res.json({ error })
    }
    CS(res)
    {
        const type = Def_Call
        res.json({ type, redirect: this.redirect })
    }
    SR(res)
    {
        res.redirect(this.redirect)
    }
    customCS(res, redirect)
    {
        const type = Def_Call
        res.json({ type, redirect })
    }
    customSR(res, redirect)
    {
        res.redirect(redirect)
    }
}

const Redirects_SR = {
    Home: new SR_Redirect("/"),
    Error: new SR_Redirect("/error"),
    Login: new SR_Redirect("/user/login"),
    Api: new SR_Redirect(),
}


module.exports = Redirects_SR;