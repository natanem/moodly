import jwt from "jsonwebtoken";

export const verify = async (req, res, next) => {
  try {
    const token = req.header("authorization").replace("Bearer ", "");
    if (!token)
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });

    const { id } = jwt.decode(token, process.env.JWT_SECRET);
    req.user = id;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token has expired. Please log in again." });
    }
    return res
      .status(401)
      .json({ message: "Invalid token. Authorization failed." });
  }
};
