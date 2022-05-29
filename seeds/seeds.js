const mongoose = require("mongoose")
const Declaration = require("../models/declaration")
const Comment = require("../models/comment")
const Reply = require("../models/reply")
const User = require("../models/user")

const { titles } = require("./seedHelpers")


mongoose.connect('mongodb://localhost:27017/ctice', {
    useNewUrlParser: true
})
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () =>
{
    console.log("connected to db main");
});

const createDeclaration = async () =>
{
    await Declaration.deleteMany({});
    await Comment.deleteMany({});
    await Reply.deleteMany({});
    const user = await User.findById("628688e92387173d390bd76e");
    for (let i = 0; i < 6; i++)
    {
        const randnum = Math.floor(Math.random() * titles.length);
        const declaration = new Declaration({
            title: titles[randnum],
            description: JSON.stringify({
                "blocks": [{ "key": "2q0qn", "text": "123", "type": "unstyled", "depth": 0, "inlineStyleRanges": [{ "offset": 0, "length": 34, "style": "BOLD" }, { "offset": 12, "length": 22, "style": "ITALIC" }], "entityRanges": [], "data": {} }], "entityMap": {}
            }),
            file: {
                name: "A.pdf",
                url: "https://res.cloudinary.com/dnu6yyl9d/image/upload/v1645538236/ctice/pdfs/A_rrpiog.pdf",
                location: "ctice/pdfs/A_rrpiog"
            },
            date: [new Date()],
            authors: [user._id],
            likes: [],
            status: "Active"
        })
        await declaration.save();
    }

}


createDeclaration();
