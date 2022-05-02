const Api_Call = "Api";
const Def_Call = "Def"

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
}

const Redirects_SR = {
    Home: new SR_Redirect("/"),
    Error: new SR_Redirect("/error"),
    Login: new SR_Redirect("/user/login"),
    Api: new SR_Redirect(),
}


module.exports = { Redirects_SR, Api_Call, Def_Call };