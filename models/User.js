import mongoose, {Schema, model} from "mongoose";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    
}, {timestamps: true})

// Middleware: Hash the plain password using Bcryptjs
userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next()

    this.password = await bcrypt.hash(this.password, 12)
    next()
})

// Method: Comparing password
userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password)
}

// Method: generate a token
userSchema.methods.generateToken =  function() {
   
    return  jwt.sign({id: this.id}, process.env.JWT_SECRET, {expiresIn: "1h"})
     
}

// Statics: Finding user by credentials
userSchema.statics.findUserByCredentials = async function(identifier, password) {
    const foundUser = await this.findOne({$or: [{ username: identifier }, { email: identifier }],})
    if(!foundUser) {
        return null
    }
    const isMatch = await foundUser.comparePassword(password)

    if(!isMatch) {
        return null
    }

    return foundUser

}

// Add this method in the user schema (models/User.js) from gpt

userSchema.statics.findByCredentials = async function (identifier, password) {
    // Try to find a user by username or email
    const user = await this.findOne({
        $or: [{ username: identifier }, { email: identifier }],
    });

    // If no user is found, return null
    if (!user) return null;

    // Compare the provided password with the stored hashed password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return null; // If the password does not match, return null

    return user; // Return the user if found and password matches
};


// userSchema.statics.verifyAndRefreshToken = function (token) {
//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         return decoded;
//     } catch (error) {
//         if (error.name === "TokenExpiredError") {
//             // Optionally implement refresh token logic here
//             return { expired: true };
//         }
//         throw error;
//     }
// };


const User = model("User", userSchema)

export default User