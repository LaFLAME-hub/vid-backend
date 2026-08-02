import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  //TODO: create tweet

  const userId = req.user._id;

  const { tweetContent } = req.body;

  if (!tweetContent?.trim()) {
    throw new ApiError(400, "Content cannot be empty");
  }

  const tweet = await Tweet.create({
    content: tweetContent,
    owner: new mongoose.Types.ObjectId(userId),
  });

  if (!tweet) {
    throw new ApiError(400, "Something went wrong while creating tweet");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, tweet, "Tweet created successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets
  const userId = req.user._id;

  const tweets = await Tweet.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    },
  ]);

  if (!tweets.length) {
    throw new ApiError(400, "No tweets found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, tweets, "Tweets fetched successfully"));
});

const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet
  const userId = req.user._id;

  const { tweetId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(tweetId)) {
    throw new ApiError(400, "Invalid tweet id");
  }

  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    throw new ApiError(404, "No tweet Found");
  }

  if (!tweet.owner.equals(userId)) {
    throw new ApiError(403, "You are not authorized");
  }
  const { newTweetContent } = req.body;

  if (!newTweetContent?.trim()) {
    throw new ApiError(400, "Tweet cannot be empty");
  }

  if (tweet.content === newTweetContent.trim()) {
    throw new ApiError(409, "Same tweet");
  }

  tweet.content = newTweetContent;

  await tweet.save();

  return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet updated successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweet

  const userId = req.user._id;
  const { tweetId} = req.params;

  if (!mongoose.Types.ObjectId.isValid(tweetId)) {
    throw new ApiError(400, "Invalid tweet id");
  }

  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    throw new ApiError(404, "No tweet Found");
  }

  if (!tweet.owner.equals(userId)) {
    throw new ApiError(403, "You are not authorized");
  }

  await tweet.deleteOne();

  return res.status(200).json(new ApiResponse(
    200,
    null,
    "Tweet deleted successfully"
))


});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
