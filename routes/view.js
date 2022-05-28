const router = require('express').Router();
const { app } = require("../main")
const Declaration = require("../models/declaration")
const Comment = require("../models/comment")
const { Redirects_SR } = require('../utilsSR/SR_Redirects');
const { isLogged_CS, tryAsync_CS,
    apiSecret, isAdmin_CS,
    checkCommentUser } = require('../utilsSR/_middlewares')
const { validateDeclr, validateComment } = require('../utilsSR/_validations')
const { getUserdata } = require("../utilsSR/_primary")

router.get("/:id", tryAsync_CS(async (req, res) =>
{
    const user = await getUserdata(req, res)
    app.render(req, res, `/view/${req.params.id}`, { user })
}))

router.post("/:id/api", apiSecret, tryAsync_CS(async (req, res, next) =>
{
    const { id } = req.params;
    const declaration = await Declaration.findById(id)
        .populate("authors", 'email status username')
    if (!declaration) next(new Error("Not Found", 404))
    Redirects_SR.Api.sendApi(res, declaration)
}))

router.post("/:id/comment/api", apiSecret, tryAsync_CS(async (req, res) =>
{
    const { id } = req.params;
    const { comments, type } = req.body;
    console.log(type)
    console.log(comments.length)
    let declaration;
    if (type === 10)
    {
        declaration = await Declaration.findById(id)
            .populate({
                path: 'comments',
                populate: {
                    path: 'author'
                },
                options: {
                    limit: process.env.COMMENTS_LOAD_LIMIT,
                    sort: { _id: -1 },
                    skip: comments.length,
                }
            })
    }
    else 
    {
        declaration = await Declaration.findById(id)
            .populate({
                path: 'comments',
                populate: {
                    path: 'author'
                },
            })
        declaration.comments
            .sort((a, b) => (a.likes.filter(el => el.typeOf === true).length - a.likes.filter(el => el.typeOf === false).length
                < b.likes.filter(el => el.typeOf === true).length - b.likes.filter(el => el.typeOf === false).length)
                ? 1
                : ((b.likes.filter(el => el.typeOf === true).length - b.likes.filter(el => el.typeOf === false).length
                    < a.likes.filter(el => el.typeOf === true).length - a.likes.filter(el => el.typeOf === false).length)
                    ? -1 : 0))
                    
        declaration.comments.splice(0, comments.length)
        declaration.comments.splice(process.env.COMMENTS_LOAD_LIMIT, declaration.comments.length)
    }
    Redirects_SR.Api.sendApi(res, declaration.comments)
}))

router.put("/:id", isLogged_CS, isAdmin_CS, validateDeclr, tryAsync_CS(async (req, res) =>
{
    const { id } = req.params;
    let declaration = await Declaration.findById(id)
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
    let declaration = await Declaration.findById(id)
    declaration.tryLike(user._id, type)
    await declaration.save();
    Redirects_SR.Api.sendApi(res, declaration.likes)
}))

router.put("/comments/:id", apiSecret, isLogged_CS, tryAsync_CS(async (req, res, next) =>
{
    const { type } = req.body
    const { id } = req.params;
    const user = await getUserdata(req, res);
    let comment = await Comment.findById(id)
    comment.tryLike(user._id, type)
    await comment.save();
    Redirects_SR.Api.sendApi(res, comment.likes)
}))

router.post("/:id/comment", isLogged_CS, validateComment, tryAsync_CS(async (req, res) =>
{
    const { id } = req.params;
    let declaration = await Declaration.findById(id)
    let comment = new Comment(await Comment.processObj(req))
    declaration.comments.push(comment)
    await declaration.save()
    await comment.save()
    Redirects_SR.Home.customCS(res, `${id}`)
}))

router.put("/:id/comment/:cid", isLogged_CS, validateComment, tryAsync_CS(async (req, res) =>
{
    const { id, cid } = req.params;
    let declaration = await Declaration.findById(id)
    let comment = await Comment.findById(cid)
    let Obj = await Comment.processObj(req, declaration, comment)
    await Comment.findByIdAndUpdate(cid, Obj)
    await declaration.save()
    Redirects_SR.Home.customCS(res, `${id}`)
}))

router.delete("/:id/comment/:cid", isLogged_CS, checkCommentUser, tryAsync_CS(async (req, res) =>
{
    const { id, cid } = req.params;
    let declaration = await Declaration.findById(id)
    let comment = await Comment.findById(cid)
    let i = await Comment.processObj(req, declaration, comment, true)
    declaration.comments.splice(i, 1);
    await Comment.findByIdAndDelete(cid)
    await declaration.save()
    req.flash('info', 'Deleted Successfuly');
    Redirects_SR.Home.customCS(res, `${id}`)
}))

router.delete("/:id", isLogged_CS, isAdmin_CS, tryAsync_CS(async (req, res) =>
{
    const { id } = req.params;
    const declaration = await Declaration.findById(id);
    await Declaration.processObj(req, declaration, true)
    await Declaration.findByIdAndDelete(id)
    req.flash('info', 'Deleted Successfuly');
    Redirects_SR.Home.CS(res)
}))

module.exports = router;