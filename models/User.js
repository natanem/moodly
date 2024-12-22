import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    bio: { type: String, maxLength: 150 },
    profilePicture: {
      type: String,
      default: "public/upload/profile_pics/default.png",
    },
    coverPhoto: { type: String, default: null },
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: Schema.Types.ObjectId, ref: "User" }],
    isVerified: { type: Boolean, default: false },
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
    },
    location: { type: String, default: null }, // City, country, etc.
    dob: { type: Date, default: null }, // Date of birth,
    postsCount: { type: Number, default: 0 }, // Count of user's posts
    badges: [{ type: String }], // Array of badge names/IDs
    // isAdmin: { type: Boolean, default: false },
    isPrivate: { type: Boolean, default: false }, // For private accounts
  },
  { timestamps: true }
);

// Middleware: Hash the plain password using Bcryptjs
userSchema.pre("save", async function (next) {
  if (this.dob) {
    const ageDiffMs = Date.now() - new Date(this.dob).getTime();
    const ageDate = new Date(ageDiffMs);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);

    if (age < 13) {
      return next(new Error("User must be at least 13 years old."));
    }
  }

  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }

  next();
});

userSchema.statics.follow = async function (userToFollowId, currentUserId) {
  if (currentUserId === userToFollowId) {
    throw new Error("You cannot follow yourself");
  }

  const me = await User.findById(currentUserId);
  const userToFollow = await User.findById(userToFollowId);

  if (!me || !userToFollow) {
    throw new Error("User not found");
  }

  const isFollowing = userToFollow.followers.includes(currentUserId);

  // return console.log(isFollowing);

  if (isFollowing) {
    userToFollow.followers = userToFollow.followers.filter(
      (id) => id.toString() !== currentUserId.toString()
    );

    me.following = me.following.filter(
      (id) => id.toString() !== userToFollowId.toString()
    );
  } else {
    userToFollow.followers.push(currentUserId);
    me.following.push(userToFollowId);
  }

  await userToFollow.save();
  await me.save();

  return isFollowing ? "unfollowed" : "followed";
};

// Method: Comparing password
userSchema.methods.comparePassword = async function (password) {
  console.log(password, this.password);
  return await bcrypt.compare(password, this.password);
};

// Method: generate a token
userSchema.methods.generateToken = function () {
  return jwt.sign({ id: this.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

userSchema.methods.updateLastActive = function () {
  this.lastActive = Date.now();
  return this.save();
};

// Statics: Finding user by credentials
userSchema.statics.findUserByCredentials = async function (
  identifier,
  password
) {
  const foundUser = await this.findOne({
    $or: [{ username: identifier }, { email: identifier }],
  });
  if (!foundUser) {
    return null;
  }
  console.log(foundUser);
  const isMatch = await foundUser.comparePassword(password);

  if (!isMatch) {
    return null;
  }

  const user = {
    id: foundUser._id,
    username: foundUser.username,
    email: foundUser.email,
    profilePicture: foundUser.profilePicture,
    coverPhoto: foundUser.coverPhoto,
    token: foundUser.generateToken(),
  };

  return user;
};

// Add this method in the user schema (models/User.js) from gpt

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

const User = model("User", userSchema);

export default User;
