const router = require('express').Router();
const { app } = require("../main")
const Declaration = require("../models/declaration")
const Comment = require("../models/comment")
const Reply = require("../models/reply")
const { Redirects_SR } = require('../utilsSR/SR_Redirects');
const { isLogged_CS, tryAsync_CS,
    apiSecret, isAdmin_CS,
    checkCommentUser } = require('../utilsSR/_middlewares')
const { validateDeclr, validateComment, } = require('../utilsSR/_validations')
const { getUserdata, switchSort, sortByScore, isAdmin, getDeclrDateSort, getCommentDateSort } = require("../utilsSR/_primary")

router.get("/:id", tryAsync_CS(async (req, res) =>
{
    const user = await getUserdata(req, res)
    app.render(req, res, `/view/${req.params.id}`, { user })
}))

router.post("/:id/api", apiSecret, tryAsync_CS(async (req, res, next) =>
{
    const { id } = req.params;
    const declaration = await Declaration.findOne({ _id: id, status: "Active" })
        .populate("authors", 'email status username')
    if (!declaration) next(new Error("Not Found", 404))
    Redirects_SR.Api.sendApi(res, declaration)
}))

router.post("/:id/comment/api", apiSecret, tryAsync_CS(async (req, res) =>
{
    const { id } = req.params;
    const { comments, type } = req.body;

    let declaration;
    const admin = await isAdmin(req, res)

    await switchSort(type, async () =>
    {
        declaration = await getDeclrDateSort(id, comments.length, admin)
    }, async () =>
    {
        declaration = await getDeclrScoreSort(id, admin)
        declaration.comments = sortByScore(declaration.comments)
        declaration.comments.splice(0, comments.length)
        declaration.comments.splice(process.env.COMMENTS_LOAD_LIMIT, declaration.comments.length)
    })

    Redirects_SR.Api.sendApi(res, declaration.comments)
}))

router.post("/:id/comment/:cid/reply/api", apiSecret, tryAsync_CS(async (req, res) =>
{
    const { id, cid } = req.params;
    const { replies } = req.body;

    const admin = await isAdmin(req, res)
    const comment = await getCommentDateSort(cid, replies.length, admin)

    Redirects_SR.Api.sendApi(res, comment.replies)
}))

router.put("/:id", isLogged_CS, isAdmin_CS, validateDeclr, tryAsync_CS(async (req, res) =>
{
    const { id } = req.params;
    let declaration = await Declaration.findOne({ _id: id, status: "Active" })
    const Obj = await Declaration.processObj(req, declaration);
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
    await reply.save();
    Redirects_SR.Api.sendApi(res, reply.likes)
}))

router.post("/:id/comment", isLogged_CS, validateComment, tryAsync_CS(async (req, res) =>
{
    const { id } = req.params;
    let declaration = await Declaration.findOne({ _id: id, status: "Active" })
    let comment = new Comment(await Comment.processObj(req))
    declaration.comments.push(comment)
    await declaration.save()
    await comment.save()
    Redirects_SR.Home.customCS(res, `${id}`)
}))

router.post("/:id/comment/:cid/reply", isLogged_CS, validateComment, tryAsync_CS(async (req, res) =>
{
    const { id, cid } = req.params;
    let comment = await Comment.findOne({ _id: cid, status: "Active" })
    let reply = new Reply(await Reply.processObj(req))
    comment.replies.push(reply)
    await comment.save()
    await reply.save()
    Redirects_SR.Home.customCS(res, `${id}`)
}))

router.post("/:id/disable", apiSecret, isLogged_CS, tryAsync_CS(async (req, res) =>
{
    const { id } = req.params;
    let declaration = await Declaration.findOne({ _id: id })
    declaration.status = declaration.status === "Active" ? "Disabled" : "Active"
    await declaration.save()
    Redirects_SR.Api.sendApi(res, { msg: "Success" })
}))

router.post("/:id/comment/:cid/disable", apiSecret, isLogged_CS, isAdmin_CS, tryAsync_CS(async (req, res) =>
{
    const { id, cid } = req.params;
    let comment = await Comment.findOne({ _id: cid })
    comment.status = comment.status === "Active" ? "Disabled" : "Active"
    await comment.save()
    Redirects_SR.Api.sendApi(res, { msg: "Success" })
}))

router.post("/:id/reply/:rid/disable", apiSecret, isLogged_CS, isAdmin_CS, tryAsync_CS(async (req, res) =>
{
    const { id, rid } = req.params;
    let reply = await Reply.findOne({ _id: rid })
    console.log(reply)
    reply.status = reply.status === "Active" ? "Disabled" : "Active"
    console.log(reply)
    await reply.save()
    Redirects_SR.Api.sendApi(res, { msg: "Success" })
}))

router.put("/:id/comment/:cid", isLogged_CS, tryAsync_CS(async (req, res) =>
{
    const { id, cid } = req.params;
    let declaration = await Declaration.findOne({ _id: id, status: "Active" })
    let comment = await Comment.findOne({ _id: cid, status: "Active" })
    let Obj = await Comment.processObj(req, declaration, comment)
    await Comment.findByIdAndUpdate(cid, Obj)
    await declaration.save()
    Redirects_SR.Home.customCS(res, `${id}`)
}))

router.put("/:id/comment/:cid/reply/:rid", isLogged_CS, tryAsync_CS(async (req, res) =>
{
    const { id, cid, rid } = req.params;
    let comment = await Comment.findOne({ _id: cid, status: "Active" })
    let reply = await Reply.findOne({ _id: rid, status: "Active" })
    let Obj = await Reply.processObj(req, comment, reply)
    await Reply.findByIdAndUpdate(rid, Obj)
    await comment.save()
    Redirects_SR.Home.customCS(res, `${id}`)
}))

router.delete("/:id/comment/:cid", isLogged_CS, checkCommentUser, tryAsync_CS(async (req, res) =>
{
    const { id, cid } = req.params;
    let declaration = await Declaration.findOne({ _id: id, status: "Active" })
    let comment = await Comment.findOne({ _id: cid, status: "Active" })
    let i = await Comment.processObj(req, declaration, comment, true)
    declaration.comments.splice(i, 1);
    await Comment.findByIdAndDelete(cid)
    await declaration.save()
    req.flash('info', 'Deleted Successfuly');
    Redirects_SR.Home.customCS(res, `${id}`)
}))

router.delete("/:id/comment/:cid/reply/:rid", isLogged_CS, checkCommentUser, tryAsync_CS(async (req, res) =>
{
    const { id, cid, rid } = req.params;
    let declaration = await Declaration.findOne({ _id: id, status: "Active" })
    let comment = await Comment.findOne({ _id: cid, status: "Active" })
    let reply = await Reply.findOne({ _id: rid, status: "Active" })
    let i = await Reply.processObj(req, comment, reply, true)
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
    await Declaration.processObj(req, declaration, true)
    await Declaration.findByIdAndDelete(id)
    req.flash('info', 'Deleted Successfuly');
    Redirects_SR.Home.CS(res)
}))

module.exports = router;