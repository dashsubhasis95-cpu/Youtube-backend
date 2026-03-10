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
    if(!mongoose.Types.ObjectId.isValid(commentId)){
        throw new ApiError(400, "Invalid comment id")
    }
    const comment = await Comment.findById(commentId)

    if(!comment){
        throw new ApiError(404, "Comment not found")
    }

    const existingLike = await Like.findOne({
        comment: commentId,
        likedBy: req.user._id
    })
    if(existingLike){
        await Like.findByIdAndDelete(existingLike._id)
        return res.status(200).json(
            new ApiResponse(200, {}, "Comment unliked")
        )
    } else {
        await Like.create({
            comment: commentId,
            likedBy: req.user._id
        })
        return res.status(200).json(
            new ApiResponse(200, {}, "Comment liked")
        )
    }


})


const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
})