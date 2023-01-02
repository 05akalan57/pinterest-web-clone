const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();

const verifyToken = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).send("Unauthorized");
  }

  const token = authorization.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send("Unauthorized");
    }

    req.decoded = decoded;
    next();
  });
};

module.exports = { verifyToken };
