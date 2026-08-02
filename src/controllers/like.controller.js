import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: toggle like on video

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  const existingLikeOnVideo = await Like.findOne({
    video: videoId,
    likedBy: req.user._id,
  });


  if (existingLikeOnVideo) {
    await Like.findByIdAndDelete(existingLikeOnVideo._id);

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Video unliked successfully"));
  }

  await Like.create({
    video: videoId,
    likedBy: req.user._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Video liked successfully"));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  //TODO: toggle like on comment

  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    throw new ApiError(400, "Invalid comment id");
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  const existingLikeOnComment = await Like.findOne({
    comment: commentId,
    likedBy: req.user._id,
  });

  if (existingLikeOnComment) {
    await Like.findByIdAndDelete(existingLikeOnComment._id);

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Comment unliked successfully"));
  }

  await Like.create({
    comment: commentId,
    likedBy: req.user._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Comment liked successfully"));
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  //TODO: toggle like on tweet

  if (!mongoose.Types.ObjectId.isValid(tweetId)) {
    throw new ApiError(400, "Invalid tweet id");
  }

  const tweet = await Tweet.findById(commentId);

  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  const existingLikeOnTweet = await Like.findOne({
    tweet: tweetId,
    likedBy: req.user._id,
  });

  if (existingLikeOnTweet) {
    await Like.findByIdAndDelete(existingLikeOnTweet._id);

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Tweet unliked successfully"));
  }

  await Like.create({
    tweet: tweetId,
    likedBy: req.user._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "tweet liked successfully"));
});

const getLikedVideos = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  //TODO: get all liked videos


  const likedVideo = await Like.aggregate([
    {
      $match: {
        likedBy: new mongoose.Types.ObjectId(userId),
        video: { $exists: true },
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "likedVideo",
      },
    },
    {
      $unwind: "$likedVideo",
    },
    {
      $project: {
        _id: "$likedVideo._id",
        title: "$likedVideo.title",
        thumbnail: "$likedVideo.thumbnail",
        views: "$likedVideo.views",
        duration: "$likedVideo.duration",
        owner: "$likedVideo.owner",
        createdAt: "$likedVideo.createdAt",
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, likedVideo, "Liked videos fetched successfully")
    );
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
