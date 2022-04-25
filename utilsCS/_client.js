import CS_Redirects from '../utilsCS/CS_Redirects'

const CropData = (data, length) =>
{
    length++;
    data.blocks = data.blocks.length > length ? data.blocks.slice(0, length) : data.blocks
    return data
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

function getCurrentDate(separator = '.')
{
    let newDate = new Date()
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();

    return `${date < 10 ? `0${date}` : `${date}`}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${year}`
}

function getSpecificDate(newDate, separator = '.')
{
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();

    return `${date < 10 ? `0${date}` : `${date}`}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${year}`
}

function handleFormData(evtTarget, file = undefined, description)
{
    const data = new FormData(evtTarget);

    if (file) data.append("file", file)
    else data.delete("file")

    data.append("description", JSON.stringify(description));
    data.append("date", getCurrentDate("."))

    const title_ = data.get("title");
    const description_ = description.blocks[0].text;

    return { data, title: title_, description: description_ }
}

function isToken(confirmationCode, func, res)
{
    if (confirmationCode)
    {
        func();
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
    if (context.req.session.passport)
    {
        isAdmin = context.req.session.passport.user === process.env.NEXT_PUBLIC_ADMIN_USERNAME
    }
    return { isUser, isAdmin }
}

async function getDeclrs()
{
    return await fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/api`, {
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
    return await fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/view/${id}/api`, {
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
    return await fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/user/api`, {
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
            if (el.date[el.date.length - 1] === date) 
            {
                dateDeclrs.push(el)
            };
        })
        return dateDeclrs;
    }
    let dateDeclrs = [];
    declrs.obj.forEach(el =>
    {
        if (el.date[el.date.length - 1] === date) 
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

module.exports = {
    CropData, uploadFile, getCurrentDate, handleFormData,
    isToken, determRendering, getGlobals, getDeclrs,
    strfyDeclrs, parseDeclrs, getDeclr, getUsers,
    getSpecificDate, logout, getDeclrsDate, getDeclrsTitle,
    getSpecificDeclrsTitle, getDeclrsDateQuery
}