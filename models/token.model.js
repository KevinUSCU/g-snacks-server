const { promisify } = require('util')
const { sign, verify } = require('jsonwebtoken')
const signPromise = promisify(sign)
const verifyPromise = promisify(verify)
const secret = process.env.SECRET_KEY

class Token {
  static signAsync({ id, first_name, role }) {
    const sub = { id, role }
    const exp = '7 days'
    return signPromise({ sub }, secret, { expiresIn })
  }

  static parseAsync(token) {
    return verifyPromise(token, secret) //on success this returns the decoded token
  }
}

module.exports = Token