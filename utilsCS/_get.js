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

function getLimitedBookmarks(bookmarks, id)
{
    return fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/user/${id}/bookmarks/api`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            { bookmarks, id, secret: process.env.NEXT_PUBLIC_SECRET }
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

const LogoutFetch = () =>
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


module.exports = {
    getLimitedComments, getLimitedReplies, getLimitedBookmarks,
    getClientUser, getUsers, LogoutFetch,
}