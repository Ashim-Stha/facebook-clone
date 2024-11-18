const User = require("../model/User");
const response = require("../utils/responseHandler");

const followUser = async (req, res) => {
  const userId = req?.user?.userId;
  const { userIdToFollow } = req.body;

  if (userId === userIdToFollow)
    return response(res, 400, "You arenot allowed to follow yourself");
  try {
    const user = await User.findById(userId);
    const userToFollow = await User.findById(userIdToFollow);

    if (!user || !userToFollow) return response(res, 404, "User not found");
    if (user.following.includes(userIdToFollow)) {
      user.following = user.following.filter(
        (id) => userIdToFollow.toString() !== id.toString()
      );
      user.followingCount = Math.max(0, user.followingCount - 1);

      userToFollow.followers = userToFollow.followers.filter(
        (id) => userId.toString !== id
      );
      userToFollow.followerCount = Math.max(0, userToFollow.followerCount - 1);

      await user.save();
      await userToFollow.save();
      return response(
        res,
        200,
        "User unfollowed successfully",
        JSON.stringify(user + userToFollow)
      );
    }
    user.following.push(userIdToFollow);
    user.followingCount += 1;
    userToFollow.followers.push(userId);
    userToFollow.followerCount += 1;

    await user.save();
    await userToFollow.save();

    return response(
      res,
      200,
      "User followed successfully",
      JSON.stringify(user + userToFollow)
    );
  } catch (e) {
    console.error(e);
    return response(res, 500, "Internal Server Error", e);
  }
};

module.exports = { followUser };
