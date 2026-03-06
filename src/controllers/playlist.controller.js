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
