function serverError(err, next) {
  /* This prints errors to the server, and sends a generic message to the client. This will surface things like database errors which may include details which we don't want the client to have details of for security reasons. We check for err.message to ignore errors with empty messages, since we use those to stop propagation of chained promises. */  
  if (err.message) {
    console.log(err)
    return next({ status: 500, message: 'Check server logs for error details' })
  }
}

module.exports = {
  serverError
}