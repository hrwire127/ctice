const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const { upload_notification } = require('../utilsSR/primary/_p_basic')
const { upload_banner } = require('../utilsSR/primary/_p_basic')
const Banner = require('./banner')

const NotificationSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    banner:
    {
        type: Schema.Types.ObjectId,
        ref: "Banner"
    },
    location: {
        type: String,
        required: true
    },
    date: {
        type: [Date],
        required: true
    },
});

NotificationSchema.statics.processObj = async function (req, res) 
{
    const { content, banner } = req.body
    const notifbuf = Buffer.from(content, 'utf8');
    const { url, location } = await upload_notification(notifbuf, res)

    let Obj = { content: url, location, date: new Date() }

    let newBanner;
    if (banner && banner !== "")
    {
        const bannerbuf = Buffer.from(banner, 'utf8');
        const { url: bannerUrl, location: bannerLocation } = await upload_banner(bannerbuf, res);
        newBanner = new Banner({ content: bannerUrl, location: bannerLocation, date: new Date(), type: "full", status: "Active" });
        await newBanner.save()
        Obj.banner = newBanner._id
    }

    return Obj;
}

const Notification = mongoose.model('Notification', NotificationSchema);

module.exports = Notification;