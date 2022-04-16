module.exports = {
    default: { message: "Something went wrong", status: 500 },
    disabledUser: { message: "Accound Disabled", status: 401 },
    noPending: { message: "No such pending", status: 403 },
    didNotWork: { message: "Did not work", status: 500 },
    userIsPending: { message: "User pending, check your email!", status: 401 },
    unauthorized: { message: "UnAuthorized", status: 401 },
    PageNotFound: { message: "Page Not Found", status: 404 },
    pendingExpired: { message: "Pending User Expired", status: 400}

}