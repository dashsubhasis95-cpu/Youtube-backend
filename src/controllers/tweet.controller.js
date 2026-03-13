const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const { content } = req.body

    if (!content || content.trim() === "") {
        throw new ApiError(400, "Content is required")
    }
    const tweet = await Tweet.create({
        content,
        owner: req.user._id
    })

    return res.status(201).json(new ApiResponse(201, tweet, "Tweet created successfully"))
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const { userId } = req.params
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(400, "Invalid user id")
     }

    const tweets = await Tweet.find({ owner: userId }).sort({ createdAt: -1 })

    return res.status(200).json(new ApiResponse(200, tweets, "User tweets fetched successfully"))
})