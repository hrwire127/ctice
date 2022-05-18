const { valRule, Rules } = require('./val-Rule');
const userError = require('./userError');
const { cloud } = require('../cloud/storage');
let streamifier = require('streamifier');

function inspectPdf(file)
{
    const maxWidth = new valRule(file.width, Rules.pdf_max_width, 0)
    if (maxWidth.getVal()) return maxWidth.processMsg()

    const minWidth = new valRule(file.width, Rules.pdf_min_width, 1)
    if (minWidth.getVal()) return minWidth.processMsg()

    const maxHeight = new valRule(file.height, Rules.pdf_max_height, 0)
    if (maxHeight.getVal()) return maxHeight.processMsg()

    const minHeight = new valRule(file.height, Rules.pdf_min_height, 1)
    if (minHeight.getVal()) return minHeight.processMsg()
}

function inspectProfile(file)
{
    const maxWidth = new valRule(file.width, Rules.profile_max_width, 0)
    if (maxWidth.getVal()) return maxWidth.processMsg()

    const minWidth = new valRule(file.width, Rules.profile_min_width, 1)
    if (minWidth.getVal()) return minWidth.processMsg()

    const maxHeight = new valRule(file.height, Rules.profile_max_height, 0)
    if (maxHeight.getVal()) return maxHeight.processMsg()

    const minHeight = new valRule(file.height, Rules.profile_min_height, 1)
    if (minHeight.getVal()) return minHeight.processMsg()
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
        throw new userError(invalid, 400)
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
        throw new userError(invalid, 400)
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

module.exports = {
    upload_pdf, doRemember, inspectPdf, inspectProfile, upload_profiles
}

