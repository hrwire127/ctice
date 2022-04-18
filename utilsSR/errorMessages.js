module.exports = {
    default: { message: "Something went wrong", status: 500 },
    disabledUser: { message: "Accound Disabled", status: 401 },
    noPending: { message: "No such pending", status: 403 },
    didNotWork: { message: "Did not work", status: 500 },
    userIsPending: { message: "User pending, check your email!", status: 401 },
    unauthorized: { message: "UnAuthorized", status: 401 },
    PageNotFound: { message: "Page Not Found", status: 404 },
<<<<<<< HEAD:utilsSR/errorMessages.js
    pendingExpired: { message: "Pending User Expired", status: 400},
    emailAllreadyUsed: { message: "Email Allready Used", status: 400 },
    usernameAllreadyUsed: { message: "Username Allready Used", status: 400}
=======
    pendingExpired: { message: "Pending User Expired", status: 400 },
    usernameAllreadyUsed: { message: "Username is allready used", status: 400 },
    emailAllreadyUsed: { message: "Email is allready used", status: 401 }
>>>>>>> 3a6d6164f1a207ed8e5c2b711b029497d99e147b:utils/errorMessages.js

}