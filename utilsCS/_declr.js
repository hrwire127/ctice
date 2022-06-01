const { nowindowFetchError } = require('./_basic')

async function getDeclrs()
{
    return fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/load/all/api`, {
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

async function loadLimitedDeclrs(declarations, date, query, doclimit = 5, sort) 
{
    return fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/load/limit/api`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            { sort, doclimit, declarations, date, query, secret: process.env.NEXT_PUBLIC_SECRET }
        )
    }).then(response => response.json())
        .then(async res =>
        {
            return res;
        })
}

async function getAllCount(declarations)
{
    return fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/count/all/api`, {
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

function getCountLimit(query, date)
{
    return fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/count/limit/api`, {
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


async function getCountDateQuery(query, date, sort)
{
    if (query === "" && date === "Invalid")
    {
        let count = await getAllCount([])
        if (nowindowFetchError(count)) return count
        return count.obj;
    }

    let count = await getCountLimit(query, date, sort)
    if (nowindowFetchError(count)) return count
    return count.obj;
}

module.exports = {
    getDeclrs, getDeclr, getCountDateQuery,
    loadLimitedDeclrs, getAllCount,
}