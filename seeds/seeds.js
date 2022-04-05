const mongoose = require("mongoose")
const Declaration = require("../models/declaration")

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
    for (let i = 0; i < 3; i++)
    {
        const randnum = Math.floor(Math.random() * titles.length);
        const declaration = new Declaration({
            title: titles[randnum],
            description: JSON.stringify({
                "blocks": [{ "key": "2q0qn", "text": "De Cumparat pentru ocazie speciala", "type": "unstyled", "depth": 0, "inlineStyleRanges": [{ "offset": 0, "length": 34, "style": "BOLD" }, { "offset": 12, "length": 22, "style": "ITALIC" }], "entityRanges": [], "data": {} }, { "key": "bvcad", "text": "lapte", "type": "unordered-list-item", "depth": 0, "inlineStyleRanges": [], "entityRanges": [], "data": {} }, { "key": "o2u5", "text": "smantana", "type": "unordered-list-item", "depth": 0, "inlineStyleRanges": [], "entityRanges": [], "data": {} }, { "key": "b6gpf", "text": "paine", "type": "unordered-list-item", "depth": 0, "inlineStyleRanges": [], "entityRanges": [], "data": {} }, { "key": "3tdaf", "text": "zahar", "type": "unordered-list-item", "depth": 0, "inlineStyleRanges": [], "entityRanges": [], "data": {} }, { "key": "fc8s0", "text": "20.02.22", "type": "unstyled", "depth": 0, "inlineStyleRanges": [{ "offset": 0, "length": 8, "style": "ITALIC" }], "entityRanges": [], "data": {} }], "entityMap": {}
            }),
            file: {
                name: "A.pdf",
                url: "https://res.cloudinary.com/dnu6yyl9d/image/upload/v1645538236/ctice/A_rrpiog.pdf",
                location: "ctice/A_rrpiog"
            },
            date: ["22.02.2022"]
        })
        await declaration.save();
    }

}


createDeclaration();
