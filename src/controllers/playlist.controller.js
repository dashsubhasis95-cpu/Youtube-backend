const createPlaylist = asyncHandler(async (req, res) => {

    const { name, description } = req.body
    const { videoId } = req.params

    if (!name || name.trim() === "") {
        throw new ApiError(400, "Playlist name is required")
    }

    const playlist = await Playlist.create({
        name: name.trim(),
        description,
        videos: videoId ? [videoId] : [],
        owner: req.user._id
    })

    return res.status(201).json(
        new ApiResponse(201, playlist, "Playlist created successfully")
    )

})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(400, "Invalid user id")
    }

    const playlists = await Playlist.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
                from: "videos",
                localfield: "videos",
                foreignField: "_id",
                as: "videos"
            }
        },
        {
            $addFields: {
                videoCount: {
                    $size: "$videos"
                },
                thumbnail: {
                    $slice: ["$videos.thumbnail", 1]
                }
            }
        },
        {
            $project: {
                name: 1,
                description: 1,
                videoCount: 1,
                thumbnail: 1,
                owner: 1,
                createdAt: 1,
            }
        },
        {
            $sort: { createdAt: -1 }
        }
    ])

    return res.status(200).json(
        new ApiResponse(
            200,
            playlists,
            "User playlists fetched successfully"
        )
    )



})

const getPlaylistById = asyncHandler(async (req, res) => {

    const { playlistId } = req.params

    if (!mongoose.Types.ObjectId.isValid(playlistId)) {
        throw new ApiError(400, "Invalid playlist id")
    }

    const playlist = await Playlist.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(playlistId)
            }
        },

        {
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "videos"
            }
        },

        {
            $addFields: {
                totalVideos: { $size: "$videos" }
            }
        }
    ])

    if (!playlist.length) {
        throw new ApiError(404, "Playlist not found")
    }

    return res.status(200).json(
        new ApiResponse(200, playlist[0], "Playlist fetched successfully")
    )
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {

    const { playlistId, videoId } = req.params

    if (!mongoose.Types.ObjectId.isValid(playlistId) || !mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid playlist id or video id")
    }

    const playlist = await Playlist.findOneAndUpdate(
        { _id: playlistId, owner: req.user._id },
        { $addToSet: { videos: videoId } },
        { new: true }
    )

    if (!playlist) {
        throw new ApiError(404, "Playlist not found or unauthorized")
    }

    return res.status(200).json(
        new ApiResponse(200, playlist, "Video added to playlist successfully")
    )

})
const removeVideoFromPlaylist = asyncHandler(async (req, res) => {

    const { playlistId, videoId } = req.params

    if (!mongoose.Types.ObjectId.isValid(playlistId) || !mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid playlist id or video id")
    }

    const playlist = await Playlist.findOneAndUpdate(
        { _id: playlistId, owner: req.user._id },
        { $pull: { videos: videoId } },
        { new: true }
    )

    if (!playlist) {
        throw new ApiError(404, "Playlist not found or unauthorized")
    }

    return res.status(200).json(
        new ApiResponse(200, playlist, "Video removed from playlist successfully")
    )

})

const deletePlaylist = asyncHandler(async (req, res) => {

    const { playlistId } = req.params

    if (!mongoose.Types.ObjectId.isValid(playlistId)) {
        throw new ApiError(400, "Invalid playlist id")
    }

    const playlist = await Playlist.findOneAndDelete({
        _id: playlistId,
        owner: req.user._id
    })

    if (!playlist) {
        throw new ApiError(404, "Playlist not found or unauthorized")
    }

    return res.status(200).json(
        new ApiResponse(200, null, "Playlist deleted successfully")
    )

})
