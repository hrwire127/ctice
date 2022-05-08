const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const LikeSchema = new Schema({
    user: {
        type: [Schema.Types.ObjectId],
        ref: "User",
        required: true
    },
})

const Like = mongoose.model("Like", LikeSchema)

module.exports = Like;