import CS_Redirects from '../utilsCS/CS_Redirects'

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

// function getCurrentDate(separator = '.')
// {
//     let newDate = new Date()
//     let date = newDate.getDate();
//     let month = newDate.getMonth() + 1;
//     let year = newDate.getFullYear();

//     return `${date < 10 ? `0${date}` : `${date}`}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${year}`
// }

// function getSpecificDate(newDate, separator = '.')
// {
//     let date = newDate.getDate();
//     let month = newDate.getMonth() + 1;
//     let year = newDate.getFullYear();

//     return `${date < 10 ? `0${date}` : `${date}`}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${year}`
// }

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
    isUser = context.req.isAuthenticated()
    isAdmin = getField(context.req.session.passport, "user", false) === process.env.NEXT_PUBLIC_ADMIN_USERNAME
    return { isUser, isAdmin }
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

function strfyDeclrs(declr)
{
    return JSON.stringify(declr)
}

function parseDeclrs(declr)
{
    return JSON.parse(declr)
}

const logout = (window) =>
{
    fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/user/logout`,
        { method: 'POST' }
    )
        .then(response => response.json())
        .then(async res =>
        {
            CS_Redirects.tryResCS(res, window)
        })
}

async function getDeclrsDate(date)
{
    const declrs = await getDeclrs()
    let newDeclrs = [];
    declrs.obj.forEach(el => { if (el.date[el.date.length - 1] === date) newDeclrs.push(el) })
    return newDeclrs;
}

async function getDeclrsTitle(title)
{
    const declrs = await getDeclrs()
    if (title === "")
    {
        return declrs.obj;
    }
    let newDeclrs = [];
    declrs.obj.forEach(el =>
    {
        if (el.title.includes(title)) 
        {
            newDeclrs.push(el)
        }
    })
    return newDeclrs;
}
async function getSpecificDeclrsTitle(title, declrs)
{
    if (title === "")
    {
        return declrs.obj;
    }
    let newDeclrs = [];
    declrs.obj.forEach(el =>
    {
        if (el.title.includes(title)) 
        {
            newDeclrs.push(el)
        };
    })
    return newDeclrs;
}

async function getDeclrsDateQuery(query, date)
{
    const declrs = await getDeclrs()
    if (query === "" && date === "Invalid")
    {
        return declrs.obj;
    }
    if (date === "Invalid")
    {
        let queryDeclrs = [];
        declrs.obj.forEach(el =>
        {
            if (el.title.includes(query)) 
            {
                queryDeclrs.push(el)
            };
        })
        return queryDeclrs;
    }
    if (query === "")
    {
        let dateDeclrs = [];
        declrs.obj.forEach(el =>
        {
            console.log()
            if (new Date(el.date[el.date.length - 1]).toDateString() === new Date(date).toDateString()) 
            {
                dateDeclrs.push(el)
            };
        })
        return dateDeclrs;
    }
    let dateDeclrs = [];
    declrs.obj.forEach(el =>
    {
        if (new Date(el.date[el.date.length - 1]).toDateString() === new Date(date).toDateString())
        {
            dateDeclrs.push(el)
        };
    })
    let queryDeclrs = [];
    dateDeclrs.forEach(el =>
    {
        if (el.title.includes(query)) 
        {
            queryDeclrs.push(el)
        };
    })
    return queryDeclrs;
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
        return `${secs} seond${secs > 1 ? "s" : ""}`
    }
}

module.exports = {
    CropData, uploadFile,
    handleDeclrData,
    isToken, determRendering, getGlobals, getDeclrs,
    strfyDeclrs, parseDeclrs, getDeclr, getUsers,
    logout, getDeclrsDate, getDeclrsTitle,
    getSpecificDeclrsTitle, getDeclrsDateQuery, timeout, getField,
    getDateDifference
}