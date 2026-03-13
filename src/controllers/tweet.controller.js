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

    const { userId } = req.params

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(400, "Invalid user id")
    }

    const tweets = await Tweet.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        }
    ])

    return res.status(200).json(
        new ApiResponse(200, tweets, "User tweets fetched successfully")
    )

})



const updateTweet = asyncHandler(async (req, res) => {

    const { tweetId } = req.params
    const { content } = req.body

    if (!mongoose.Types.ObjectId.isValid(tweetId)) {
        throw new ApiError(400, "Invalid tweet id")
    }

    if (!content || content.trim() === "") {
        throw new ApiError(400, "Content is required")
    }

    const updatedTweet = await Tweet.findOneAndUpdate(
        {
            _id: tweetId,
            owner: req.user._id   // ensures only owner can update
        },
        {
            content: content.trim()
        },
        {
            new: true
        }
    )

    if (!updatedTweet) {
        throw new ApiError(404, "Tweet not found or unauthorized")
    }

    return res.status(200).json(
        new ApiResponse(200, updatedTweet, "Tweet updated successfully")
    )

})