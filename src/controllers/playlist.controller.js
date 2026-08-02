import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const userId = req.user._id;

  //TODO: create playlist

  if (!name?.trim() || !description?.trim()) {
    throw new ApiError(400, "Name and description are required");
  }

  const existingPlaylist = await Playlist.findOne({
    owner: userId,
    name: name.trim(),
  });

  if (existingPlaylist) {
    throw new ApiError(409, "A playlist with this name already exists");
  }

  const playlist = await Playlist.create({
    name: name.trim(),
    description: description.trim(),
    owner: userId,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, playlist, "Playlist created Successfully"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const {userId} = req.params;
  //TODO: get user playlists

  if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(400, "Invalid user id");
    }

  const userPlaylists = await Playlist.find({
    owner: new mongoose.Types.ObjectId(userId),
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, userPlaylists, "User playlists fetched successfully")
    );
});

const getPlaylistById = asyncHandler(async (req, res) => {

  const userId = req.user._id;

  const { playlistId } = req.params;
  //TODO: get playlist by id

  if (!mongoose.Types.ObjectId.isValid(playlistId)) {
        throw new ApiError(400, "Invalid playlist id");
    }

     const playlist = await Playlist.aggregate([
        // 1. Match playlist
        {
            $match:{
                _id: new mongoose.Types.ObjectId(playlistId)
            }
        },

        // 2. Lookup owner details
        {
            $lookup:{
                from:"users",
                localField:"owner",
                foreignField:"_id",
                as: "owner",
                pipeline:[
                    {
                        $project:{
                            username:1,
                            fullname:1,
                            avatar:1
                        }
                    }
                ]
            }
        },

        // 3. Unwind owner

        {
            $unwind: "$owner"
        },

        // 4. Lookup videos
        {
            $lookup:{
                from: "videos",
                localField: "videos",
                foreignField:"_id",
                as :  "playlistVideos",
                pipeline:[
                    {
                        $project:{
                            title:1,
                            thumbnail:1,
                            duration:1,
                            owner:1
                        }
                    }
                ]
            }
        }

    ]);



    if (!playlist.length) {
        throw new ApiError(404, "Playlist not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            playlist[0],
            "Playlist fetched successfully"
        )
    );


});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(playlistId)) {
    throw new ApiError(400, "Invalid playlist id");
  }

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }

  const playlist = await Playlist.findById(playlistId);

  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  if (!playlist.owner.equals(userId)) {
    throw new ApiError(403, "You are not authorized to modify this playlist");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  const updatedPlaylist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $addToSet: {
        videos: videoId,
      },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedPlaylist,
        "Video added to playlist successfully"
      )
    );
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(playlistId)) {
    throw new ApiError(400, "Invalid playlist id");
  }

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }

  const playlist = await Playlist.findById(playlistId);

  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  if (!playlist.owner.equals(userId)) {
    throw new ApiError(403, "You are not authorized to modify this playlist");
  }

  const updatedPlaylist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $pull: {
        videos: videoId,
      },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedPlaylist,
        "Video removed from playlist successfully"
      )
    );
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(playlistId)) {
    throw new ApiError(400, "Invalid playlist id");
  }

  const playlist = await Playlist.findById(playlistId);

  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  if (!playlist.owner.equals(userId)) {
    throw new ApiError(403, "You are not authorized to delete this playlist");
  }

  await playlist.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Playlist deleted successfully"));
});

const updatePlaylist = asyncHandler(async (req, res) => {
  //TODO: update playlist

  const { playlistId } = req.params;
  const { name, description } = req.body;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(playlistId)) {
    throw new ApiError(400, "Invalid playlist id");
  }

  if (!name?.trim()) {
    throw new ApiError(400, "Playlist name is required");
  }

  if (!description?.trim()) {
    throw new ApiError(400, "Playlist description is required");
  }

  const playlist = await Playlist.findById(playlistId);

  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  if (!playlist.owner.equals(userId)) {
    throw new ApiError(403, "You are not authorized to update this playlist");
  }

  playlist.name = name.trim();
  playlist.description = description.trim();

  await playlist.save();

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist updated successfully"));
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
