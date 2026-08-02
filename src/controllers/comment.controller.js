import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  const skip = (Number(page) - 1) * Number(limit);

  const videoComments = await Comment.aggregate([
    {
      $match: {
        video: mongoose.Types.ObjectId(videoId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "commenterDetail",
        pipeline: [
          {
            $project: {
              username: 1,
              fullname: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$commenterDetail",
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $skip: skip,
    },
    {
      $limit: Number(limit),
    },
  ]);

  return res
      .status(200)
      .json(new ApiResponse(200, videoComments, "Video comments fetched successfully"));

});

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video
  const userId = req.user._id;

  const { videoId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  const { commentContent } = req.body;

  if (!commentContent?.trim()) {
    throw new ApiError(400, "Comment cannot be empty");
  }

  const comment = await Comment.create({
    content: commentContent.trim(),
    video: mongoose.Types.ObjectId(videoId),
    owner: mongoose.Types.ObjectId(userId),
  });

  if (!comment) {
    throw new ApiError(400, "Something went wrong while creating comment");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, comment, "Comment created successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
  const userId = req.user._id;

  const { commentId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    throw new ApiError(400, "Invalid comment id");
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  if (!comment.owner.equals(userId)) {
    throw new ApiError(403, "User is not authorized");
  }

  const { commentContent } = req.body;

  if (!commentContent?.trim()) {
    throw new ApiError(400, "Comment cannot be empty");
  }

  if (comment.content === commentContent?.trim()) {
    throw new ApiError(400, "Comment cannot be same");
  }

  comment.content = commentContent?.trim();

  await comment.save();

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment updated successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment

  const userId = req.user._id;

  const { commentId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    throw new ApiError(400, "Invalid comment id");
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  if (!comment.owner.equals(userId)) {
    throw new ApiError(403, "User is not authorized");
  }

  await Comment.findByIdAndDelete(commentId);

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment deleted successfully"));
});

export { getVideoComments, addComment, updateComment, deleteComment };
