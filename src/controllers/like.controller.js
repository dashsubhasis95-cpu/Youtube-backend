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

    const { commentId } = req.params

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiError(400, "Invalid comment id")
    }

    const commentExists = await Comment.exists({ _id: commentId })

    if (!commentExists) {
        throw new ApiError(404, "Comment not found")
    }

    const existingLike = await Like.findOne({
        comment: commentId,
        likedBy: req.user._id
    })

    let isLiked

    if (existingLike) {

        await Like.deleteOne({ _id: existingLike._id })

        isLiked = false

    } else {

        await Like.create({
            comment: commentId,
            likedBy: req.user._id
        })

        isLiked = true
    }

    const likeCount = await Like.countDocuments({
        comment: commentId
    })

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                isLiked,
                likeCount
            },
            "Comment like toggled successfully"
        )
    )

})


const toggleTweetLike = asyncHandler(async (req, res) => {
    
    const { tweetid } = req.params

    if (!mongoose.Types.ObjectId.isValid(tweetid)) {
        throw new ApiError(400, "Invalid tweet id")
    }
    const tweetExists = await Tweet.exists({ _id: tweetid })

    if (!tweetExists) {
        throw new ApiError(404, "Tweet not found")
    }

    const existingLike = await Like.findOne({
        tweet: tweetid,
        likedBy: req.user._id
    })
    let isLiked

    if (existingLike) {
        await Like.deleteOne({ _id: existingLike._id })
        isLiked = false
    } else {
        await Like.create({
            tweet: tweetid,
            likedBy: req.user._id
        })
        isLiked = true
    }

    const likeCount = await Like.countDocuments({
        tweet: tweetid
    })

    return res.status(200).json(
        new ApiResponse(200,
            {
                isLiked,
                likeCount
            },
                "Tweet like toggled successfully"
        )
    )

}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
})