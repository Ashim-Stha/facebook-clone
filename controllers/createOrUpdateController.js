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

module.exports = { createOrUpdateBio };
