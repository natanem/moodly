import User from "../models/User.js"

export const getProfile = async(req, res, next) => {
    try {
        const user = await User.findById(req.user).select("-password")
    
        if(!user) {
            return res.status(404).json({message: "User not found."})
        }
        res.send(user)
    } 
        catch (error) {
            next(error)
        }
    
}

export const updateProfile = async(req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(req.user, req.body, {new: true})
    
        if(!user) {
            res.status(404).json({message: "User not found"})
        }

        res.status(200).json({ message: "Profile updated successfully", user });
    } 
        catch (error) {
            next(error)
        }
}
export const deleteProfile = async(req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.user)
    
        if(!user) {
            return res.status(404).json({message: "User not found"})
        }

        res.status(200).json({ message: "Profile deleted successfully", user });
    } 
        catch (error) {
            next(error)
        }
}