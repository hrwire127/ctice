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

function getCurrentDate(separator = '')
{
    let newDate = new Date()
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

function withUser(props)
{
    const user = props.query.user
    return { user }
}

function getGlobals(context)
{
    let isUser; //admin + isUser for all pages
    let admin = false;
    isUser = context.req.isAuthenticated()
    if (context.req.session.passport)
    {
        admin = context.req.session.passport.user === process.env.NEXT_PUBLIC_ADMIN_USERNAME
        console.log(admin)
    }
    return { isUser, admin }
}

function handleRes(res)
{
    if (res.type === "Error")
    {
        context.req.session.error = res.error;
        context.res.redirect(res.redirect)
    }
    else if (res.type === "Login")
    {
        window.location = res.redirect
    }
    else 
    {
        return res.obj;
    }
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

function strfyDeclrs(declr)
{
    return JSON.stringify(declr)
}

function parseDeclrs(declr)
{
    return JSON.parse(declr)
}

module.exports = {
    CropData, uploadFile, getCurrentDate,
    handleFormData, isToken, withUser,
    determRendering, getGlobals, handleRes, getDeclrs,
    strfyDeclrs, parseDeclrs
}