const router = require('express').Router();
const { app } = require("../main")
const UserError = require('../utilsSR/general/userError')
const Declaration = require("../models/declaration")
const Comment = require("../models/comment")
const Reply = require("../models/reply")
const Redirects_SR = require('../utilsSR/general/SR_Redirects');
const errorMessages = require("../utilsSR/rules/errorMessages")
const { tryAsync_CS, tryAsync_SR, apiSecret } = require('../utilsSR/middlewares/_m_basic')
const { isLogged_CS, isAdmin_CS } = require('../utilsSR/middlewares/_m_user')
const { verifyCommentUser } = require('../utilsSR/middlewares/_m_verify')
const { validateDeclr, validateComment } = require('../utilsSR/middlewares/_m_validations')
const { getDeclrDateSort, getDeclrScoreSort } = require("../utilsSR/primary/_p_declrApi")
const { switchSort, sortByScore } = require('../utilsSR/primary/_p_basic')
const { getUserdata, existsAdmin } = require('../utilsSR/primary/_p_user')

router.get("/:id", tryAsync_SR(async (req, res, next) =>
{
    const { id } = req.params;
    const user = await getUserdata(req, res)
    app.render(req, res, `/view/${id}`, { user })
}))

router.post("/:id/api", apiSecret, tryAsync_CS(async (req, res) =>
{
    const { id } = req.params;

    const declaration = await Declaration.findOne({ _id: id, status: "Active" }).populate('authors').populate('tags')

    if (declaration) Redirects_SR.Api.sendApi(res, declaration)
    else throw new UserError(...Object.values(errorMessages.PageNotFound))
}))

router.post("/:id/comment/api", apiSecret, tryAsync_CS(async (req, res) =>
{
    const { id } = req.params;
    const { comments, type, doclimit } = req.body;

    let declaration;
    const admin = await existsAdmin(req, res)

    await switchSort(type, async () =>
    {
        declaration = await getDeclrDateSort(id, comments.length, admin, doclimit)
    }, async () =>
    {
        declaration = await getDeclrScoreSort(id, comments.length, admin, doclimit)
    })

    Redirects_SR.Api.sendApi(res, declaration.comments)
}))

router.post("/:id/comment/:cid/reply/api", apiSecret, tryAsync_CS(async (req, res) =>
{
    const { cid } = req.params;
    const { replies, doclimit } = req.body;

    const admin = await existsAdmin(req, res)

    const findPip = admin ? { _id: cid } : { _id: cid, status: "Active" }
    const populatePip = {
        path: 'replies',
        populate: {
            path: 'author'
        },
    }

    if (admin) populatePip.match = { status: "Active" }
    populatePip.options = {
        limit: doclimit,
        sort: { _id: -1 },
        skip: replies.length,
    }

    const comment = await Comment.findOne(findPip).populate(populatePip)

    Redirects_SR.Api.sendApi(res, comment.replies)
}))

router.put("/:id", isLogged_CS, isAdmin_CS, validateDeclr, tryAsync_CS(async (req, res) =>
{
    const { id } = req.params;
    let declaration = await Declaration.findOne({ _id: id, status: "Active" })
    const Obj = await Declaration.processObj(req, res, declaration);
    await Declaration.findByIdAndUpdate(id, Obj)
    req.flash('success', 'Edited Successfuly');
    Redirects_SR.Home.CS(res)
}))

router.put("/likes/:id", apiSecret, isLogged_CS, tryAsync_CS(async (req, res, next) =>
{
    const { type } = req.body
    const { id } = req.params;
    const user = await getUserdata(req, res);
    let declaration = await Declaration.findOne({ _id: id, status: "Active" })
    declaration.tryLike(user._id, type)
    await declaration.processNotifLike(req, res)
    await declaration.save();
    Redirects_SR.Api.sendApi(res, declaration.likes)
}))

router.put("/comments/:cid", apiSecret, isLogged_CS, tryAsync_CS(async (req, res, next) =>
{
    const { type } = req.body
    const { cid } = req.params;
    const user = await getUserdata(req, res);
    let comment = await Comment.findOne({ _id: cid, status: "Active" })
    comment.tryLike(user._id, type)
    await comment.processNotifLike(req, res)
    await comment.save();
    Redirects_SR.Api.sendApi(res, comment.likes)
}))

router.put("/replies/:rid", apiSecret, isLogged_CS, tryAsync_CS(async (req, res, next) =>
{
    const { type } = req.body
    const { rid } = req.params;
    const user = await getUserdata(req, res);
    let reply = await Reply.findOne({ _id: rid, status: "Active" })
    reply.tryLike(user._id, type)
    await reply.processNotifLike(req, res)
    await reply.save();
    Redirects_SR.Api.sendApi(res, reply.likes)
}))

router.post("/:id/comment", isLogged_CS, validateComment, tryAsync_CS(async (req, res) =>
{
    const { id } = req.params;
    let declaration = await Declaration.findOne({ _id: id, status: "Active" })
    let comment = new Comment(await Comment.processObj(req, res))
    declaration.comments.push(comment)
    await comment.processNotifComment(req, res);
    await declaration.save()
    await comment.save()
    Redirects_SR.Home.customCS(res, `${id}`)
}))

router.post("/:id/comment/:cid/reply", isLogged_CS, validateComment, tryAsync_CS(async (req, res) =>
{
    const { id, cid } = req.params;
    let comment = await Comment.findOne({ _id: cid, status: "Active" })
    let reply = new Reply(await Reply.processObj(req, res))
    comment.replies.push(reply)
    await reply.processNotifReply(req, res);
    await comment.save()
    await reply.save()
    Redirects_SR.Home.customCS(res, `${id}`)
}))

router.post("/:id/switchstatus", apiSecret, isLogged_CS, tryAsync_CS(async (req, res) =>
{
    const { id } = req.params;
    let declaration = await Declaration.findOne({ _id: id })
    declaration.status = declaration.status === "Active" ? "Disabled" : "Active"
    await declaration.save()
    Redirects_SR.Api.sendApi(res, true)
}))

router.post("/:id/comment/:cid/switchstatus", apiSecret, isLogged_CS, isAdmin_CS, tryAsync_CS(async (req, res) =>
{
    const { cid } = req.params;
    let comment = await Comment.findOne({ _id: cid })
    comment.status = comment.status === "Active" ? "Disabled" : "Active"
    await comment.save()
    Redirects_SR.Api.sendApi(res, true)
}))

router.post("/:id/reply/:rid/switchstatus", apiSecret, isLogged_CS, isAdmin_CS, tryAsync_CS(async (req, res) =>
{
    const { rid } = req.params;
    let reply = await Reply.findOne({ _id: rid })
    reply.status = reply.status === "Active" ? "Disabled" : "Active"
    await reply.save()
    Redirects_SR.Api.sendApi(res, true)
}))

router.put("/:id/comment/:cid", isLogged_CS, tryAsync_CS(async (req, res) =>
{
    const { id, cid } = req.params;
    let declaration = await Declaration.findOne({ _id: id, status: "Active" })
    let comment = await Comment.findOne({ _id: cid, status: "Active" })
    let Obj = await Comment.processObj(req, res, declaration, comment)
    await Comment.findByIdAndUpdate(cid, Obj)
    await declaration.save()
    Redirects_SR.Home.customCS(res, `${id}`)
}))

router.put("/:id/comment/:cid/reply/:rid", isLogged_CS, tryAsync_CS(async (req, res) =>
{
    const { id, cid, rid } = req.params;
    let comment = await Comment.findOne({ _id: cid, status: "Active" })
    let reply = await Reply.findOne({ _id: rid, status: "Active" })
    let Obj = await Reply.processObj(req, res, comment, reply)
    await Reply.findByIdAndUpdate(rid, Obj)
    await comment.save()
    Redirects_SR.Home.customCS(res, `${id}`)
}))

router.delete("/:id/comment/:cid", isLogged_CS, verifyCommentUser, tryAsync_CS(async (req, res) =>
{
    const { id, cid } = req.params;
    let declaration = await Declaration.findOne({ _id: id, status: "Active" })
    let comment = await Comment.findOne({ _id: cid, status: "Active" })
    let i = await Comment.processObj(req, res, declaration, comment, true)
    declaration.comments.splice(i, 1);
    await Comment.findByIdAndDelete(cid)
    await declaration.save()
    req.flash('info', 'Deleted Successfuly');
    Redirects_SR.Home.customCS(res, `${id}`)
}))

router.delete("/:id/comment/:cid/reply/:rid", isLogged_CS, verifyCommentUser, tryAsync_CS(async (req, res) =>
{
    const { id, cid, rid } = req.params;
    let declaration = await Declaration.findOne({ _id: id, status: "Active" })
    let comment = await Comment.findOne({ _id: cid, status: "Active" })
    let reply = await Reply.findOne({ _id: rid, status: "Active" })
    let i = await Reply.processObj(req, res, comment, reply, true)
    comment.replies.splice(i, 1);
    await Reply.findByIdAndDelete(cid)
    await comment.save()
    req.flash('info', 'Deleted Successfuly');
    Redirects_SR.Home.customCS(res, `${id}`)
}))

router.delete("/:id", isLogged_CS, isAdmin_CS, tryAsync_CS(async (req, res) =>
{
    const { id } = req.params;
    const declaration = await Declaration.findOne({ _id: id, status: "Active" })
    await Declaration.processObj(req, res, declaration, true)
    await Declaration.findByIdAndDelete(id)
    req.flash('info', 'Deleted Successfuly');
    Redirects_SR.Home.CS(res)
}))

module.exports = router;