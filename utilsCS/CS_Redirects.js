class CS_Redirect
{
    constructor(types)
    {
        this.types = types;
    }
    CS(res)
    {
        this.types.foreach(el =>
        {
            if (res.type === el)
            {
                window.location = res.redirect
            }
        })
    }
    SR(res)
    {
        this.types.foreach(el =>
        {
            if (res.type === el)
            {
                props.req.session.error = res.error;
                props.res.redirect(res.redirect)
            }
        })
    }
}

const Redirects_CS = {
    Home: new CS_Redirect("Home"),
    Error: new CS_Redirect("Error"),
    Login: new CS_Redirect("Login"),
    Api: new CS_Redirect("Api"),
}

module.exports = Redirects_CS;