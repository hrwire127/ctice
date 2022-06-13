const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const { upload_banner } = require('../utilsSR/primary/_p_basic')
const { cloud } = require('../cloud/storage');

const BannerSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    date: {
        type: [Date],
        required: true
    },
    location: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Active", "Disabled"],
        required: true
    }
});


BannerSchema.statics.processObj = async function (obj, req, res) 
{
    const { content } = req.body
    if (obj)
    {
        await cloud.destroy(obj.location, {
            resource_type: "raw",
            invalidate: true,
            type: 'upload'
        }, (res, err) => 
        {
            console.log(res)
            console.log(err)
        })
    }
    if (content)
    {
        const buf = Buffer.from(content, 'utf8');

        const { url, location } = await upload_banner(buf, res)

        return { content: url, location, date: new Date(), status: "Active" }
    }
}

const Banner = mongoose.model('Banner', BannerSchema);

module.exports = Banner;