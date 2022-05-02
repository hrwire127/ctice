import CS_Redirects from '../utilsCS/CS_Redirects'
const { Api_Call, Def_Call } = require('../utilsSR/SR_Redirects')

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

const uploadFile = (e, changeState) =>
{
    const file = e.target.files[0];
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
    data.append("date", new Date())

    const title_ = data.get("title");
    const description_ = description.blocks[0].text;

    return { data, title: title_, description: description_ }
}

function isToken(confirmationCode, func, res)
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
    if(context.req.session.passport) isUser = context.req.session.passport.user
    isAdmin = getField(context.req.session.passport, "user", false) === process.env.NEXT_PUBLIC_ADMIN_USERNAME
    return { isUser, isAdmin }
}

async function getUsers()
{
    return fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/user/api`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            { secret: process.env.NEXT_PUBLIC_SECRET }
        )
    }).then(response => response.json())
        .then(async res =>
        {
            return res;
        })
}

const logout = () =>
{
    fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/user/logout`,
        { method: 'POST' }
    )
        .then(response => response.json())
        .then(async res =>
        {
            return res;
        })
}

async function getDeclrs()
{
    return fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/api`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            { secret: process.env.NEXT_PUBLIC_SECRET }
        )
    }).then(response => response.json())
        .then(async res =>
        {
            return res;
        })
}

async function getDeclr(id)
{
    return fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/view/${id}/api`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            { secret: process.env.NEXT_PUBLIC_SECRET }
        )
    }).then(response => response.json())
        .then(async res =>
        {
            return res;
        })
}

async function getLimitedDeclrs(declarations, date, query)
{
    return fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/limit/api`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            { declarations, date, query, secret: process.env.NEXT_PUBLIC_SECRET }
        )
    }).then(response => response.json())
        .then(async res =>
        {
            return res;
        })
}

async function getAllCount(declarations)
{
    return fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/countall/api`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            { declarations, secret: process.env.NEXT_PUBLIC_SECRET }
        )
    }).then(response => response.json())
        .then(async res =>
        {
            return res;
        })
}

function getDeclrsQuery(query)
{
    return fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/query/api`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            { query, secret: process.env.NEXT_PUBLIC_SECRET }
        )
    }).then(response => response.json())
        .then(async res =>
        {
            return res;
        })
}

function getDeclrsDate(date)
{
    return fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/date/api`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            { date, secret: process.env.NEXT_PUBLIC_SECRET }
        )
    }).then(response => response.json())
        .then(async res =>
        {
            return res;
        })
}

function getLimitCount(query, date)
{
    return fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/countlimit/api`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            { query, date, secret: process.env.NEXT_PUBLIC_SECRET }
        )
    }).then(response => response.json())
        .then(async res =>
        {
            return res;
        })
}

function checkFetchError(res)
{
    if(res.type)
    {
        if(res.type === Def_Call)
        {
            return true
        }
    }
    return false;
}

async function getCountDateQuery(query, date)
{
    if (query === "" && date === "Invalid")
    {
        let count = await getAllCount([])
        if(checkFetchError(count)) return count
        return count.obj;
    }

    let count = await getLimitCount(query, date)
    if(checkFetchError(count)) return count
    return count.obj;
}

async function getDeclrsDateQuery(query, date)
{
    if (query === "" && date === "Invalid")
    {
        let count = await getLimitedDeclrs([], "Invalid", "")
        if(checkFetchError(count)) return count
        return count.obj;
    }

    if (date === "Invalid")
    {
        let queryDeclrs = await getDeclrsQuery(query)
        if(checkFetchError(queryDeclrs)) return queryDeclrs
        return queryDeclrs.obj;
    }
    if (query === "")
    {
        let dateDeclrs = await getDeclrsDate(date)
        if(checkFetchError(dateDeclrs)) return dateDeclrs
        return dateDeclrs.obj;
    }
    let newDeclrs = []
    let dateDeclrs = await getDeclrsDate(date)
    if(checkFetchError(dateDeclrs)) return dateDeclrs
    dateDeclrs.obj.forEach((el) =>
    {
        if (el.title.includes(query))
        {
            newDeclrs.push(el)
        }
    })
    return newDeclrs;
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

module.exports = {
    CropData, uploadFile,
    handleDeclrData,
    isToken, determRendering, getGlobals, getDeclrs,
    getDeclr, getUsers, getDeclrsDate,
    logout, getDeclrsQuery, getCountDateQuery,
    getDeclrsDateQuery, timeout, getField,
    getDateDifference, getLimitedDeclrs, getAllCount
}