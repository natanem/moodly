import User from "../models/User.js";

export const allUsers = async (req, res, next) => {
  const users = await User.find().select("username followers following");
  res.send(users);
};

export const myProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user).select("-password");

    if (!user) {
      throw new Error("User not found.");
    }
    res.send(user);
  } catch (error) {
    next(error);
  }
};
export const getProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");

    if (!user) {
      throw new Error("User not found.");
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
      throw new Error(`User not found`);
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
      throw new Error("User not found");
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

    if (!req.file) {
      throw new Error("No file uploaded.");
    }

    const outputFilePath = `upload/profile_pics/${req.file.filename}-optimized.jpeg`;
    await sharp(req.file.path)
      .resize(300, 300) // Resize to 300x300 pixels
      .jpeg({ quality: 80 }) // Optimize JPEG quality
      .toFile(outputFilePath);

    // Delete original file to save space
    await fs.unlink(req.file.path);

    // Update user profile picture
    user.profilePicture = outputFilePath;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile picture uploaded successfully.",
      profilePicture: user.profilePicture,
    });

    res.json({
      success: true,
      message: "Profile picture uploaded successfully",
      profilePic: user.profilePic,
    });
  } catch (error) {
    next(error);
  }
};

export const toggleFollow = async (req, res, next) => {
  try {
    const { id } = req.params;

    const data = await User.follow(id, req.user);

    res.json({
      status: "success",
      message: `${data} successfully"`,
    });
  } catch (error) {
    next(error);
  }
};
