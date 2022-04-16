const { valRule, Rules } = require('./val-Rule');
const { excRule } = require('./exc-Rule');
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

async function ProcessDeclr(body = undefined, files = undefined, declaration = undefined, del = false)
{
    const hadFile = declaration ? declaration['file']['url'] !== undefined : undefined;

    let Obj = {
        ...body
    }

    if (del)
    {
        await new excRule([], [], async () =>
        {
            if (declaration.file.location)
            {
                await cloud.destroy(
                    declaration.file.location,
                )
            }
        }, true).Try();
        return;
    }


    Obj.date = declaration ? declaration.date : []
    Obj.date.push(body.date)

    let q = await new excRule([body.file, files, hadFile], [], async () =>
    {
        let file = await upload(files.file)
        await cloud.destroy(
            declaration.file.location,
        )
        Obj.file = {
            name: files.file.name,
            url: file.url,
            location: file.location
        }
    }).Try();
    if (q) return Obj;

    let w = await new excRule([body.file, files], [hadFile], async () =>
    {
        let file = await upload(files.file)
        Obj.file = {
            name: files.file.name,
            url: file.url,
            location: file.location
        }
    }).Try();
    if (w) return Obj;

    let e = await new excRule([], [body.file, files, hadFile], async () =>
    { }).Try();
    if (e) return Obj;

    let r = await new excRule([hadFile], [body.file, files,], async () =>
    {
        await cloud.destroy(
            declaration.file.location,
        )
        declaration.file = undefined
        await declaration.save();
    }).Try();
    if (r) return Obj;

    let t = await new excRule([body.file, hadFile], [files], async () =>
    {
        Obj.file = declaration.file;
    }).Try()
    if (t) return Obj;

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
    upload, doRemember, ProcessDeclr, inspectFile
}
