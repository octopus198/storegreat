import jwt from "jsonwebtoken";

export const authenticationValidator = (req, res, next) => {
  const authHeader = req.headers["authorization"]; 
  const token = authHeader && authHeader.split(" ")[1];
  console.log(token);
  if (!token) {
    console.log("authentication validator error - no access token");
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_PRIVATE_KEY, (err, user) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        console.log("Token has expired");
        return res.status(403).json({ error: "Token has expired" });
      }
      if (err.name === "JsonWebTokenError") {
        console.log("Token is invalid");
        return res.status(403).json({ error: "Token is invalid" });
      }
      if (err.name === "NotBeforeError") {
        console.log("Token not active");
        return res.status(403).json({ error: "Token not active" });
      }
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};


