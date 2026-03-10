const toggleVideoLike = asyncHandler(async (req, res) => {

    const { videoId } = req.params

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    const existingLike = await Like.findOne({
        video: videoId,
        likedBy: req.user._id
    })

    if (existingLike) {

        await Like.findByIdAndDelete(existingLike._id)

        return res.status(200).json(
            new ApiResponse(200, {}, "Video unliked")
        )

    } else {

        await Like.create({
            video: videoId,
            likedBy: req.user._id
        })

        return res.status(200).json(
            new ApiResponse(200, {}, "Video liked")
        )
    }

})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    

})
