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
      return response(res, 404, "User already following this user");
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

const unfollowUser = async (req, res) => {
  const userId = req?.user?.userId;
  const { userIdToUnfollow } = req.body;
  try {
    const user = await User.findById(userId);
    const userToUnfollow = await User.findById(userIdToUnfollow);

    if (!user || !userToUnfollow) return response(res, 404, "User not found");
    if (!user.following.includes(userIdToUnfollow))
      return response(res, 404, "You arenot following this user");

    user.following = user.following.filter(
      (id) => userIdToUnfollow.toString() !== id.toString()
    );
    user.followingCount = Math.max(0, user.followingCount - 1);

    userToUnfollow.followers = userToUnfollow.followers.filter(
      (id) => userId.toString() !== id.toString()
    );
    userToUnfollow.followerCount = Math.max(
      0,
      userToUnfollow.followerCount - 1
    );

    await user.save();
    await userToUnfollow.save();

    return response(
      res,
      200,
      "User unfollowed successfully",
      JSON.stringify(user + userToUnfollow)
    );
  } catch (e) {
    console.error(e);
    return response(res, 500, "Internal Server Error", e);
  }
};

const deleteUserFromRequest = async (req, res) => {
  const userId = req?.user?.userId;
  const { reqSenderId } = req.body;
  try {
    const user = await User.find(userId);
    const reqSender = await User.find(reqSenderId);

    if (!user || !reqSender) return response(res, 404, "User not found");

    if (!reqSender.following.includes(userId))
      return response(res, 404, "No request found from this user");

    reqSender.following = reqSender.following.filter(
      (id) => id.toString() !== userId
    );
    reqSender.followingCount = reqSender.following.length;

    user.followers = user.followers.filter((id) => id.toString !== reqSenderId);
    user.followerCount = user.followers.length;

    await user.save();
    await reqSender.save();

    return (
      res, 200, `Follow request from ${reqSender.username} deleted successfully`
    );
  } catch (e) {
    console.error(e);
    return response(res, 500, "Internal Server Error", e);
  }
};

module.exports = { followUser, unfollowUser, deleteUserFromRequest };
