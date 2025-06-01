import { verifyToken } from "@Application/common/utils/access";
export const getHeader = (req, header) => req.headers[header];

export default (req, res, next) => {
  const token = getHeader(req, "authorization");

  if (!token) {
    return res.status(400).send("No token provided.");
  }
  return verifyToken(token, (err, { id } = {}) => {
    if (err) {
      return res.status(401).send("Failed to authenticate token.");
    }

    if (!id) {
      return res.status(403).send("Wrong credentials");
    }
    req.userId = id;
    return next();
  });
};
