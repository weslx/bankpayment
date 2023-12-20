import jwt from "jsonwebtoken";
import "dotenv/config";
const JWTSECRET = process.env.JWT_SECRET;

function VerificarToken(req, res, next) {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).send("Token necessario para continuar");
  }
  try {
    const decoded = jwt.verify(token, JWTSECRET);
    req.user = decoded;
    req.body.token = decoded;
  } catch (err) {
    return res.status(401).json(err);
  }
  return next();
}

export default VerificarToken;
