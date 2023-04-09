const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')

dotenv.config()

const verifyToken = (req, res, next) => {
  const { authorization } = req.headers

  if (!authorization) {
    res.status(401).send('Unauthorized')
  } else {
    const token = authorization.split(' ')[1]

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        res.status(401).send('Unauthorized')
      } else {
        req.decoded = decoded
        next()
      }
    })
  }
}

module.exports = { verifyToken }
