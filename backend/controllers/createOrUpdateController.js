const { uploadFileToCloudinary } = require("../config/cloudinary");
const User = require("../model/User");
const Bio = require("../model/UserBio");
const response = require("../utils/responseHandler");

const createOrUpdateBio = async (req, res) => {
  const { userId } = req.params;
  const {
    bioText,
    liveIn,
    relationship,
    workplace,
    education,
    phone,
    hometown,
  } = req.body;
  try {
    let bio = await Bio.findOneAndUpdate(
      {
        user: userId,
      },
      {
        bioText,
        liveIn,
        relationship,
        workplace,
        education,
        phone,
        hometown,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!bio) {
      bio = new Bio({
        user: userId,
        bioText,
        liveIn,
        relationship,
        workplace,
        education,
        phone,
        hometown,
      });
      await bio.save();
      await User.findByIdAndUpdate(userId, { bio: bio._id });
    }

    return response(res, 201, "Bio created or updated successfully", bio);
  } catch (e) {
    console.error(e);
    return response(res, 500, "Internal Server Error", e);
  }
};

const updateCoverPhoto = async (req, res) => {
  const { userId } = req.params;
  const file = req.file;
  let coverPhoto = null;
  try {
    if (file) {
      const uploadResult = await uploadFileToCloudinary(file);
      coverPhoto = uploadResult?.secure_url;
    }

    if (!coverPhoto) return response(res, 400, "failed to upload cover photo");
    // const updateUser=await User.findByIdAndUpdate(userId,{coverPhoto})
    // const updateUser = await User.updateOne(
    //   { _id: userId },
    //   {
    //     $set: {
    //       coverPhoto,
    //     },
    //   }
    // );
    const updateUser = await User.findByIdAndUpdate(
      userId,
      { coverPhoto },
      { new: true } // Ensures the updated document is returned
    );
    return response(res, 200, "Cover photo updated successfully", updateUser);
  } catch (e) {
    console.error(e);
    return response(res, 500, "Internal Server Error", e);
  }
};

const updateUserProfile = async (req, res) => {
  const { userId } = req.params;
  const { username, gender, dateOfBirth } = req.body;
  const file = req.file;
  let profilePicture = null;

  try {
    if (file) {
      const updatedResult = await uploadFileToCloudinary(file);
      profilePicture = updatedResult?.secure_url;
    }

    if (!profilePicture && !username && !gender && !dateOfBirth) {
      return response(res, 400, "No data to update");
    }

    const updateFields = {};
    if (username !== undefined) updateFields.username = username;
    if (gender !== undefined) updateFields.gender = gender;
    if (dateOfBirth !== undefined) updateFields.dateOfBirth = dateOfBirth;
    if (profilePicture) updateFields.profilePicture = profilePicture;

    const updateUser = await User.updateOne(
      { _id: userId },
      { $set: updateFields }
    );

    const updatedUser = await User.findById(userId);
    if (!updatedUser) return response(res, 404, "User not found");
    return response(res, 200, "User profile updated successfully", updatedUser);
  } catch (e) {
    console.error(e);
    return response(res, 500, "Internal Server Error", e);
  }
};

module.exports = { createOrUpdateBio, updateCoverPhoto, updateUserProfile };
