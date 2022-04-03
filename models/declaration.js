const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const DeclarationSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    file:
    {
        name: {
            type: String
        },
        url: {
            type: String
        },
        location: {
            type: String
        }
    },
    date: {
        type: String,
        required: true
    }

});


module.exports = mongoose.model('Declaration', DeclarationSchema)