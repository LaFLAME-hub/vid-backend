import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(channelId)) {
    throw new ApiError(400, "Invalid channel id");
  }

  const [totalVideos, totalSubscribers, totalViewsresult, totalLikesResult] =
    await Promise.all([
      Video.countDocuments({ owner: channelId }),
      Subscription.countDocuments({ channel: channelId }),
      Video.aggregate([
        {
          $match: {
            owner: mongoose.Types.ObjectId(channelId),
          },
        },
        {
          $group: {
            _id: null,
            totalViews: {
              $sum: "$views",
            },
          },
        },
      ]),
      Video.aggregate([
        {
          $match: {
            owner: new mongoose.Types.ObjectId(channelId),
          },
        },
        {
          $lookup: {
            from: "likes",
            localField: "_id",
            foreignField: "video",
            as: "videoLikes",
          },
        },
        {
          $addFields: {
            likesCount: {
              $size: "$videoLikes",
            },
          },
        },
        {
          $group: {
            _id: null,
            totalLikes: {
              $sum: "$likesCount",
            },
          },
        },
      ]),
    ]);

  const totalViews = totalViewsResult[0]?.totalViews || 0;
  const totalLikes = totalLikesResult[0]?.totalLikes || 0;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalVideos,
        totalSubscribers,
        totalViews,
        totalLikes,
      },
      "Channel stats fetched successfully"
    )
  );
});

const getChannelVideos = asyncHandler(async (req, res) => {
  // TODO: Get all the videos uploaded by the channel

  const { channelId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(channelId)) {
    throw new ApiError(400, "Invalid channel id");
  }

  const videos = await Video.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(channelId),
      },
    },
    {
      $project: {
        thumbnail: 1,
        views: 1,
        title: 1,
        duration: 1,
        createdAt: 1,
        isPublished: 1,
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Channel videos fetched successfully"));
});

export { getChannelStats, getChannelVideos };
