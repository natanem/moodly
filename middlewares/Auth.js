import jwt from "jsonwebtoken"

export const verify = async (req, res, next) => {
  try {
      const token = req.header("authorization").replace("Bearer ", "")
      if(!token) return res.status(401).json({ message: "No token, authorization denied" });
  
      const {id} = jwt.decode(token, process.env.JWT_SECRET)
      req.user = id
      
      next()
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
}

