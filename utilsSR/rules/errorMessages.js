const ValRules = require('./validRules')

module.exports = {
    default: { message: "Something went wrong", status: 500 },
    disabledUser: { message: "Accound Disabled", status: 401 },
    noPending: { message: "No such pending", status: 403 },
    didNotWork: { message: "Did not work", status: 500 },
    userIsPending: { message: "User pending, check your email!", status: 401 },
    unauthorized: { message: "UnAuthorized", status: 401 },
    PageNotFound: { message: "Page Not Found", status: 404 },
    pendingExpired: { message: "Pending User Expired", status: 400 },
    tokenExpired: { message: "Token User Expired", status: 400 },
    emailAllreadyUsed: { message: "Email Allready Used", status: 400 },
    usernameAllreadyUsed: { message: "Username Allready Used", status: 400 },
    userNotFound: { message: "User Not Found", status: 404 },
    likeExists: { message: "User Exists", status: 401 },
    didNotMatch: { message: "User Did Not Match", status: 400 },
    delayed: { message: "Cannot modify now, try later", status: 401 },
    tooManyEdits: { message: `Exceeded the max times of changes (${ValRules.dates_length})`, status: 401 },
    tooManyImages: { message: `Exceeded the max size of the gallery (${ValRules.gallery_length})`, status: 401 }

}