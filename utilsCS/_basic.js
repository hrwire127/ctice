const { Api_Call, Def_Call } = require('../utilsSR/rules/apiCalls')
import { sortScore, sortDate } from '../components/context/sortEnum'
import { styleFull, styleCompact } from '../components/context/styleEnum'

const CropData = (data, length) =>
{
    length++;
    data.blocks = data.blocks.length > length ? data.blocks.slice(0, length) : data.blocks
    return data
}

function getField(obj, key, alt)
{
    if (obj)
    {
        return obj[key]
    }
    else
    {
        return alt
    }
}

const uploadFile = (file, changeState) =>
{
    file.arrayBuffer().then(data => changeState(
        {
            lastModified: file.lastModified,
            name: file.name,
            size: file.size,
            type: file.type,
            webkitRelativePath: file.webkitRelativePath,
            data: data,
        }
    ));
}

function handleDeclrData(evtTarget, file = undefined, description)
{
    const data = new FormData(evtTarget);

    if (file) data.append("file", file)
    else data.delete("file")

    data.append("description", JSON.stringify(description));
    // data.append("date", new Date())


    const title_ = data.get("title");
    const description_ = description.blocks[0].text;

    return { data, title: title_, description: description_ }
}

function isResetToken(confirmationCode, func, res)
{
    if (confirmationCode)
    {
        return func();

    }
    else
    {
        res.redirect(`${process.env.NEXT_PUBLIC_DR_HOST}/user/login`)
    }
}

function determRendering(context, funcCS, funcSR)
{
    if (context.req)
    {
        return funcSR();
    }
    else
    {
        return funcCS()
    }
}

function getGlobals(context)
{
    let isUser;
    let isAdmin = false;
    let lightTheme = true;
    let style = styleFull;
    let sort = sortDate;
    if (context.req.session.passport) isUser = context.req.session.passport.user
    if (context.req.session.light) lightTheme = context.req.session.light
    if (context.req.session.style) style = context.req.session.style
    if (context.req.session.sort) sort = context.req.session.sort
    isAdmin = getField(context.req.session.passport, "user", false) === process.env.NEXT_PUBLIC_ADMIN_USERNAME
    return { isUser, isAdmin, lightTheme, style, sort }
}

function nowindowFetchError(res)
{
    if (res.type)
    {
        if (res.type === Def_Call)
        {
            return true
        }
    }
    return false;
}

function timeout(ms)
{
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getDateDifference(d2, d1)
{
    let diffTime = Math.abs(d2.valueOf() - d1.valueOf());
    let days = diffTime / (24 * 60 * 60 * 1000);
    let hours = (days % 1) * 24;
    let minutes = (hours % 1) * 60;
    let secs = (minutes % 1) * 60;
    [days, hours, minutes, secs] = [Math.floor(days), Math.floor(hours), Math.floor(minutes), Math.floor(secs)]

    if (days > 0)
    {
        return `${days} day${days > 1 ? "s" : ""}`
    }
    else if (hours > 0)
    {
        return `${hours} hour${hours > 1 ? "s" : ""}`
    }
    else if (minutes > 0)
    {
        return `${minutes} minute${minutes > 1 ? "s" : ""}`
    }
    else if (secs > 0)
    {
        return `${secs} second${secs > 1 ? "s" : ""}`
    }
}


function getFlash(props)
{
    let flash = props.res ? props.res.locals.flash[0] : undefined;
    if (props.res) 
    {
        props.res.locals.flash = []
    }
    return flash;
}

function checkToken(id)
{
    return fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/user/reset/exists`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                { secret: process.env.NEXT_PUBLIC_SECRET, id }
            )
        }).then(response => response.json())
}

module.exports = {
    CropData, uploadFile,
    handleDeclrData, isResetToken,
    determRendering, getGlobals,
    timeout, getField,
    getDateDifference, getFlash,
    checkToken, nowindowFetchError
}