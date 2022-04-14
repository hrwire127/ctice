const mongoose = require('mongoose')
const passportLocalMongoose = require("passport-local-mongoose")
const Schema = mongoose.Schema;


const UserSchema = new Schema({
    
    email: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        required: true,
        enum: ['Disabled', 'Active'],
        default: 'Disabled'
    },
    confirmationCode: {
        type: String,
        unique: true
    },
    // name: {
    //     type: String,
    //     required: true,
    //     unique: true
    // },
    // passport: {
    //     type: String,
    //     required: true
    // }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema)