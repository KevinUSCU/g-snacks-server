function serverError(err, next) {
  /* This prints errors to the server while sending a generic message to the client. This will surface things like database errors which may include details which we don't want the client to have details of for security reasons. We check for err.message to ignore errors with empty messages as we will use those to stop propagation of chained promises. */  
  if (err.message) {
    console.log(err)
    return next({ status: 500, message: 'Check server logs for error' })
  }
}

class ThrowError {
  // throw new Error() in this context will prevent following .then code and be caught by serverError()

  static requestorInvalid (next) {
    next({ status: 401, message: 'Requestor is not a valid user' })
    throw new Error()
  }

  static unauthorizedUser (next) {
    next({ status: 401, message: 'User is not authorized to access this resource' })
    throw new Error()
  }

  static invalidToken (next) {
    next({ status: 401, message: 'A valid authorization token is required' })
    throw new Error() 
  }

  static noSuchUser (next) {
    next({ status: 404, message: `Requested user does not exist` })
    throw new Error()
  }

  static duplicateUser (next) {
    next({ status: 409, message: 'A user with this email address already exists' })
    throw new Error()
  }

  static invalidPassword (next) {
    next({ status: 401, message: 'Incorrect password' })
    throw new Error()
  }
}

module.exports = {
  serverError,
  ThrowError
}