const { TopologyDescription } = require("mongodb");
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

    return response(res, 200, "User followed successfully", {
      user,
      userToFollow,
    });
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

    return response(res, 200, "User unfollowed successfully", {
      user,
      userToUnfollow,
    });
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

const getAllFriendRequest = async (req, res) => {
  const { userId } = req?.user;

  try {
    const user = await User.findById(userId).select("followers following");
    if (!user) {
      return response(res, 404, "User not found");
    }

    const userToFollowBack = await User.find({
      _id: {
        $in: user.followers,
        $nin: user.following,
      },
    }).select("username profilePicture email followerCount");
    return response(
      res,
      200,
      "users to follow back got successfully",
      userToFollowBack
    );
  } catch (e) {
    console.error(e);
    return response(res, 500, "Internal Server Error", e);
  }
};

const getAllUserForRequest = async (req, res) => {
  try {
    const loggedInUserId = req.user.userId;

    //find the logged in user and retrive their followers and following

    const loggedInUser = await User.findById(loggedInUserId).select(
      "followers following"
    );
    if (!loggedInUser) {
      return response(res, 404, "User not found");
    }

    //find user who  neither followers not following of the login user
    const userForFriendRequest = await User.find({
      _id: {
        $ne: loggedInUser, //user who follow the logged in user
        $nin: [...loggedInUser.following, ...loggedInUser.followers], // exclued both
      },
    }).select("username profilePicture email followerCount");

    return response(
      res,
      200,
      "user for frined request get successfully ",
      userForFriendRequest
    );
  } catch (error) {
    return response(res, 500, "Internal server error", error.message);
  }
};

const getAllMutualFriends = async (req, res) => {
  const userId = req?.user?.userId;
  try {
    const user = await User.findById(userId)
      .select("followers following ")
      .populate(
        "followers",
        "username profilePicture email followerCount followingCount"
      )
      .populate(
        "following",
        "username profilePicture email followerCount followingCount"
      );

    if (!user) {
      return response(res, 404, "User not found");
    }

    const followingUserId = new Set(
      user.following.map((user) => user._id.toString())
    );

    const mutualFriends = user.followers.filter((follower) =>
      followingUserId.has(follower._id.toString())
    );

    return response(res, 200, "Mutual friends got successfully", mutualFriends);
  } catch (e) {
    console.error(e);
    return response(res, 500, "Internal Server Error", e);
  }
};

const getAllUser = async (req, res) => {
  try {
    const users = await User.find().select(
      "username profilePicture email followerCount followingCount"
    );
    return response(res, 200, "users got successfully", users);
  } catch (e) {
    console.error(e);
    return response(res, 500, "Internal Server Error", e);
  }
};

const checkUserAuth = async (req, res) => {
  const userId = req?.user?.userId;
  if (!userId) return response(res, 403, "unauthenticated! please login");
  try {
    const user = await User.findById(userId).select("-password");
    if (!user) return response(res, 403, "user not found");

    return response(res, 201, "user is allowed to use facebook", user);
  } catch (e) {
    console.error(e);
    return response(res, 500, "Internal Server Error", e);
  }
};

const getUserProfile = async (req, res) => {
  const loggedInUserId = req?.user?.userId;
  const { userId } = req.params;
  try {
    const userProfile = await User.findById(userId).select("-password");
    if (!userProfile) return response(res, 403, "user not found");

    const isOwner = userId === loggedInUserId;
    return response(res, 201, "user profile got successfully", {
      user: userProfile,
      isOwner,
    });
  } catch (e) {
    console.error(e);
    return response(res, 500, "Internal Server Error", e);
  }
};

module.exports = {
  followUser,
  unfollowUser,
  deleteUserFromRequest,
  getAllFriendRequest,
  getAllUserForRequest,
  getAllMutualFriends,
  getAllUser,
  checkUserAuth,
  getUserProfile,
};
