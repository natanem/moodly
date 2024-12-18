import User from "../models/User.js";

export const allUsers = async (req, res, next) => {
  const users = await User.find().select("username followers following");
  res.send(users);
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.send(user);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const allowedUpdates = ["location", "username", "email", "bio"];
    const invalidFields = Object.keys(req.body).filter(
      (field) => !allowedUpdates.includes(field)
    );

    if (invalidFields.length) {
      throw new Error(`Invalid fields: ${invalidFields.join(", ")}`);
    }
    const user = await User.findByIdAndUpdate(req.user, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      throw new Error("User not found");
      // res.status(404).json({message: "User not found"})
    }

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    next(error);
  }
};
export const deleteProfile = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Profile deleted successfully", user });
  } catch (error) {
    next(error);
  }
};

export const uploadProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user);

    if (!user) {
      throw new Error("User not found");
    }

    user.profilePicture = `upload/profile_pics/${req.file.filename}`;
    await user.save();

    res.json({
      success: true,
      message: "Profile picture uploaded successfully",
      profilePic: user.profilePic,
    });
    res.json();
  } catch (error) {
    next(error);
  }
};

export const toggleFollow = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.user.toString() === id.toString())
      throw new Error("You can't follow/unfollow yourself");
    const userToFollow = await User.findById(id);
    const me = await User.findById(req.user);
    console.log(userToFollow);
    if (!userToFollow) throw new Error("User not found");

    if (userToFollow.followers.includes(me.id)) {
      userToFollow.followers = userToFollow.followers.filter(
        (u) => u.id.toString() !== me.id.toString()
      );
      me.following = me.following.filter(
        (u) => u.id.toString() !== userToFollow.id.toString()
      );
    } else {
      userToFollow.followers.push(me);
      me.following.push(userToFollow);
    }

    await userToFollow.save();
    await me.save();

    res.json({
      status: "success",
      message: "Followed successfully",
    });
  } catch (error) {
    next(error);
  }
};
