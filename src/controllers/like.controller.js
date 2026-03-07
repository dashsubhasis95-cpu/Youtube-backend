const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    const video = await Video.findById(videoId)

    if(!mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError(400, "Invalid video id")
    }

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    const like = await Like.findByIdAndUpdate(
        { video: videoId, likedBy: req.user._id },
        { $set: { isLiked: !like.isLiked } },
        { new: true, upsert: true }
    )
})

