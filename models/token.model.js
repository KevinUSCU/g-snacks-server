const { promisify } = require('util')
const { sign, verify } = require('jsonwebtoken')
const signPromise = promisify(sign)
const verifyPromise = promisify(verify)
const secret = process.env.SECRET_KEY

class Token {
  // Both of these Token methods are async and return a promise

  static sign(id) {
    const sub = { id }
    const expiresIn = '7 days'
    return signPromise({ sub }, secret, { expiresIn })
  }

  static verifyAndExtractHeaderToken(header) {
    const token = header.authorization ? header.authorization.replace('Bearer ', '') : null
    return verifyPromise(token, secret) //on success this returns the decoded token
  }
}

module.exports = Token
