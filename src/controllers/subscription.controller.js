

const toggleSubscription = asyncHandler(async (req, res) => {

    const { channelId } = req.params

    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiError(400, "Invalid channel id")
    }

    const existingSubscription = await Subscription.findOne({
        subscriber: req.user._id,
        channel: channelId
    })

    if (existingSubscription) {

        await Subscription.findByIdAndDelete(existingSubscription._id)

        return res.status(200).json(
            new ApiResponse(200, {}, "Unsubscribed from channel")
        )
    }

    await Subscription.create({
        subscriber: req.user._id,
        channel: channelId
    })

    return res.status(200).json(
        new ApiResponse(200, {}, "Subscribed to channel")
    )

})

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    if(!mongoose.Types.ObjectId.isValid(channelId)){
        throw new ApiError(400, "Invalid channel id")
     }

     const subscribers = await Subscription.aggregate([
        {
            $match:
            {
                channel: new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "subscriber",
                foreignField: "_id",
                as: "subscriberInfo"
            }

        },
        {
            $unwind: "$subscriberInfo"
        }
     ])
    return res.status(200).json(
        new ApiResponse(200, subscribers, "Subscribers fetched successfully")
    )
})

const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    if (!mongoose.Types.ObjectId.isValid(subscriberId)) {
        throw new ApiError(400, "Invalid subscriber id")
    }
    const channels = await Subscription.aggregate([
        {
            $match: {
                subscriber: new mongoose.Types.ObjectId(subscriberId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "channel",
                foreignField: "_id",
                as: "channelInfo"
            }
        },
        {
            $unwind: "$channelInfo"
        }
    ])
    return res.status(200).json(
        new ApiResponse(200, channels, "Subscribed channels fetched successfully")
    )

})


const 
