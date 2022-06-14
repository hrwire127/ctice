async function getLimitedComments(comments, id, type)
{
    return fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/view/${id}/comment/api`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            { type, comments, secret: process.env.NEXT_PUBLIC_SECRET }
        )
    }).then(response => response.json())
        .then(async res =>
        {
            return res;
        })
}

async function getLimitedReplies(replies, cid, id)
{
    return fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/view/${id}/comment/${cid}/reply/api`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            { replies, secret: process.env.NEXT_PUBLIC_SECRET }
        )
    }).then(response => response.json())
        .then(async res =>
        {
            return res;
        })
}

function getLimitedBookmarks(bookmarks, doclimit, id)
{
    return fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/user/${id}/bookmarks/api`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            { bookmarks, id, doclimit, secret: process.env.NEXT_PUBLIC_SECRET }
        )
    }).then(response => response.json())
        .then(async res =>
        {
            return res;
        })
}


function loadLimitedBookmarks(bookmarks, query, doclimit, id)
{
    return fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/user/${id}/bookmarks/load/api`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            { bookmarks, doclimit, query, id, secret: process.env.NEXT_PUBLIC_SECRET }
        )
    }).then(response => response.json())
        .then(async res =>
        {
            return res;
        })
}
function countLimitedBookmarks(query, id)
{
    return fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/user/${id}/bookmarks/count/api`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            { query, id, secret: process.env.NEXT_PUBLIC_SECRET }
        )
    }).then(response => response.json())
        .then(async res =>
        {
            return res;
        })
}
async function getUsers()
{
    return fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/user/all/api`, {
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

function getClientUser()
{
    return fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/user/one/api`, {
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

function LogoutFetch() 
{
    return fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/user/logout`,
        {
            method: 'POST'
        })
        .then(response => response.json())
        .then(async res =>
        {
            return res;
        })
}

function getBanners()
{
    return fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/admin/banner/all/api`, {
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

function getBanner(id)
{
    return fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/admin/banner/${id}/api`, {
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

function getLatestBanners()
{
    return fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/user/banner/last/api`, {
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

function getUserNotifications()
{
    return fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/user/notifications/api`, {
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

function getTags()
{
    return fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/tags/api`, {
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

module.exports = {
    getLimitedComments, getLimitedReplies, getLimitedBookmarks,
    getClientUser, getUsers, LogoutFetch, loadLimitedBookmarks,
    countLimitedBookmarks, getBanners, getBanner, getLatestBanners,
    getUserNotifications, getTags
}