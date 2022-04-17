const { valRule, Rules } = require('./val-Rule');
const userError = require('./userError');
const { cloud } = require('../cloud/storage');
let streamifier = require('streamifier');

function inspectFile(file)
{
    const maxWidth = new valRule(file.width, Rules.file_max_width, 0)
    if (maxWidth.getVal()) return maxWidth.processMsg()

    const minWidth = new valRule(file.width, Rules.file_min_width, 1)
    if (minWidth.getVal()) return minWidth.processMsg()

    const maxHeight = new valRule(file.height, Rules.file_max_height, 0)
    if (maxHeight.getVal()) return maxHeight.processMsg()

    const minHeight = new valRule(file.height, Rules.file_min_height, 1)
    if (minHeight.getVal()) return minHeight.processMsg()
}

const upload = async (file) =>
{
    const res = await new Promise((resolve, reject) =>
    {
        let cld_upload_stream = cloud.upload_stream(
            {
                folder: process.env.CLOUD_FOLDER,
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
    const invalid = await inspectFile(res);
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
    upload, doRemember, inspectFile
}

