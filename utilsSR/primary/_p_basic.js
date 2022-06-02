let streamifier = require('streamifier');
const UserError = require('../general/UserError');
const { cloud } = require('../../cloud/storage');

async function switchSort(sort, dateFunc, scoreSort)
{
    if (sort === 10)
    {
        return dateFunc()
    }
    else if (sort === 20)
    {
        return scoreSort()
    }
}

function sortByScore(declarations)
{
    return declarations.sort((a, b) => (a.likes.filter(el => el.typeOf === true).length - a.likes.filter(el => el.typeOf === false).length
        < b.likes.filter(el => el.typeOf === true).length - b.likes.filter(el => el.typeOf === false).length)
        ? 1
        : ((b.likes.filter(el => el.typeOf === true).length - b.likes.filter(el => el.typeOf === false).length
            < a.likes.filter(el => el.typeOf === true).length - a.likes.filter(el => el.typeOf === false).length)
            ? -1 : 0))
}

function modifyDesc(description)
{
    let newDesc = description;
    for (var i = newDesc.blocks.length - 1; i > 0; i--)
    {
        if (newDesc.blocks[i].text === "")
        {
            newDesc.blocks = newDesc.blocks.slice(0, i);
        }
        else 
        {
            break;
        }
    }
    let last = newDesc.blocks.length - 1;
    for (var i = newDesc.blocks[last].text.length - 1; i > 0; i--)
    {
        if (newDesc.blocks[last].text[i] === " ")
        {
            newDesc.blocks[last].text = newDesc.blocks[last].text.slice(0, i);
        }
        else 
        {
            break;
        }
    }
    return newDesc
}

function genToken()
{
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let token = '';
    for (let i = 0; i < 25; i++)
    {
        token += characters[Math.floor(Math.random() * characters.length)];
    }
    return token;
}


const upload_pdf = async (file) =>
{
    const res = await new Promise((resolve, reject) =>
    {
        let cld_upload_stream = cloud.upload_stream(
            {
                folder: process.env.CLOUD_FOLDER_PDFS,
            },
            function (err, res)
            {
                if (res)
                {
                    resolve(res);
                } else
                {
                    reject(err);
                }
            }
        );

        streamifier.createReadStream(file.data).pipe(cld_upload_stream);
    });
    const invalid = await inspectPdf(res);
    if (invalid)
    {
        await cloud.destroy(
            res.public_id,
        )
        throw new UserError(invalid, 400)
    }

    return {
        url: res.url,
        location: res.public_id
    }
}

const upload_profiles = async (file) =>
{
    const res = await new Promise((resolve, reject) =>
    {
        let cld_upload_stream = cloud.upload_stream(
            {
                folder: process.env.CLOUD_FOLDER_PROFILES,
            },
            function (err, res)
            {
                if (res)
                {
                    resolve(res);
                } else
                {
                    reject(err);
                }
            }
        );

        streamifier.createReadStream(file.data).pipe(cld_upload_stream);
    });
    const invalid = await inspectProfile(res);
    if (invalid)
    {
        await cloud.destroy(
            res.public_id,
        )
        throw new UserError(invalid, 400)
    }

    return {
        url: res.url,
        location: res.public_id
    }
}


function doRemember(req, res, next)
{
    if (req.body.doRemember)
    {
        req.session.cookie.maxAge = 1000 * 60 * 3;
    } 
    else
    {
        req.session.cookie.expires = false;
    }
    next();
}



module.exports = { switchSort, sortByScore, modifyDesc, genToken, upload_pdf, doRemember, upload_profiles }