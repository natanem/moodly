import User from "../models/User.js";
export const register = async (req, res) => {
    try {
      const userExists = await User.findOne({username:req.body.username});
      if (userExists) {
        return res.status(400).json({ message: "User already exists" });
      }
      const newUser = new User(req.body);
      await newUser.save();
      res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }

  export const login = async (req, res) => {

    try {
      const {username, password} = req.body
      const user = await User.findByCredentials(username, password);
      if (!user) return res.status(400).json({ message: "Invalid credentials" });
      const token = user.generateToken()
      res.send(token);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }