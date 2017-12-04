function processError(err, next) {
  /* This selectively prints errors to the server and client. In the default case, where the error comes from a function such as knex, etc. where sending details to the client may be a security concern, we instead send a generic message to the client and print the details on the server. This process also helps prevent the continued execution of chained promises after the error was thrown. */  
  if (err.message) {
    switch (err.message) {
      case 'requestorInvalid':
        return next({ status: 401, message: 'Requestor is not a valid user' })
        break
      case 'unauthorizedUser':
        return next({ status: 401, message: 'User is not authorized to access this resource' })
        break
      case 'invalidToken':
        return next({ status: 401, message: 'A valid authorization token is required' })
        break
      case 'noSuchUser':
        return next({ status: 404, message: `Requested user does not exist` })
        break
      case 'duplicateUser':
        return next({ status: 409, message: 'A user with this email address already exists' })
        break
      case 'invalidPassword':
        return next({ status: 401, message: 'Incorrect password' })
        break
      default:
        console.log(err)
        return next({ status: 500, message: 'Check server logs for error' })
    }
  }
}

module.exports = processError