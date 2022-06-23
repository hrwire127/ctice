class CS_Redirect
{
    Custom_SR(res, red)
    {
        res.redirect(red)
    }
    Custom_CS(red)
    {
        window.location = red;
    }
    handleRes(res, window, setError)
    {
        if (res.redirect) window.location = res.redirect
        if (res.error) setError(res.error)
    }
}

const Redirects_CS = new CS_Redirect();

module.exports = Redirects_CS;