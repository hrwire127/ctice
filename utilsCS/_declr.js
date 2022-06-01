const { Api_Call, Def_Call } = require('../utilsSR/rules/apiCalls')
const { nowindowFetchError } = require('./_basic')

async function getDeclrs()
{
    return fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/loadall/api`, {
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
    return fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/loadlimit/api`, {
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

function getDeclrsQuery(query, doclimit = 5, sort) 
{
    return fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/query/api`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            { sort, doclimit, query, secret: process.env.NEXT_PUBLIC_SECRET }
        )
    }).then(response => response.json())
        .then(async res =>
        {
            return res;
        })
}

function getDeclrsDate(date, doclimit = 5, sort) 
{
    return fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/date/api`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            { sort, date, doclimit, secret: process.env.NEXT_PUBLIC_SECRET }
        )
    }).then(response => response.json())
        .then(async res =>
        {
            return res;
        })
}

function getDeclrsAll(date, query, doclimit = 5, sort) 
{
    return fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/datequery/api`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            { sort, date, query, doclimit, secret: process.env.NEXT_PUBLIC_SECRET }
        )
    }).then(response => response.json())
        .then(async res =>
        {
            return res;
        })
}

function getCountLimit(query, date)
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

async function getDeclrsDateQuery(query, date, doclimit = 5, sort)
{
    if (query === "" && date === "Invalid")
    {
        let count = await loadLimitedDeclrs([], "Invalid", "", doclimit, sort)
        if (nowindowFetchError(count)) return count
        return count.obj;
    }

    if (date === "Invalid")
    {
        let queryDeclrs = await getDeclrsQuery(query, doclimit, sort)
        if (nowindowFetchError(queryDeclrs)) return queryDeclrs
        return queryDeclrs.obj;
    }
    if (query === "")
    {
        let dateDeclrs = await getDeclrsDate(date, doclimit, sort)
        if (nowindowFetchError(dateDeclrs)) return dateDeclrs
        return dateDeclrs.obj;
    }

    const newDeclrs = await getDeclrsAll(date, query, doclimit, sort)
    return newDeclrs.obj
}

module.exports = {
    getDeclrs, getDeclr, getDeclrsDate,
    getDeclrsQuery, getCountDateQuery,
    getDeclrsDateQuery, loadLimitedDeclrs, getAllCount,
}