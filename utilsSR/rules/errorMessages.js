const ValRules = require('./validRules')

module.exports = {
    default: { message: "Something went wrong", status: 500 },
    disabledUser: { message: "Accound Disabled", status: 403 },
    noPending: { message: "No such pending", status: 404 },
    didNotWork: { message: "Did not work", status: 500 },
    userIsPending: { message: "User pending, check your email!", status: 429 },
    unauthorized: { message: "Unauthorized", status: 401 },
    PageNotFound: { message: "Page Not Found", status: 404 },
    pendingExpired: { message: "Pending User Expired", status: 403 },
    tokenExpired: { message: "Token User Expired", status: 403 },
    emailAlreadyUsed: { message: "Email Allready Used", status: 409 },
    usernameAlreadyUsed: { message: "Username Allready Used", status: 409 },
    userNotFound: { message: "User Not Found", status: 404 },
    likeExists: { message: "User Exists", status: 409 },
    didNotMatch: { message: "User Did Not Match", status: 400 },
    delayed: { message: "Cannot modify now, try later", status: 429 },
    tooManyEdits: { message: `Exceeded the max times of changes (${ValRules.dates_length}). Contact the admin for any request`, status: 400 },
    tooManyImages: { message: `Exceeded the max size of the gallery (${ValRules.gallery_length}). Contact the admin for any request`, status: 400 },
    tagExists: {message: 'Tag allready exists', status: 409}
}