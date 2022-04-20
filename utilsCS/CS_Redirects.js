const { Api_Call, Def_Call } = require('../utilsSR/SR_Redirects')

class CS_Redirect
{
    constructor()
    {

    }
    tryCS(res)
    {
        if (res.type === Def_Call)
        {
            window.location = res.redirect
        }
    }
    trySR(res)
    {
        if (res.type === Def_Call)
        {
            props.req.session.error = res.error;
            props.res.redirect(res.redirect)
        }
    }
    Custom_SR(res, red)
    {
        res.redirect(red)
    }
    Custom_CS(red)
    {
        window.location = red;
    }
}

const Redirects_CS = new CS_Redirect();

module.exports = Redirects_CS;