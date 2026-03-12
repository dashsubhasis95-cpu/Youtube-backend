import e = require("express")

const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params

    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiError(400, "Invalid channel id")
    }

    const Subscriptionexists = await Subscription.exists({
        subscriber: req.user._id,
        channel: channelId
    })
    if(!Subscriptionexists){
        throw new ApiError(404, "Channel not found")
    }

    const existingSubscription = await Subscription.findOne({
        subscriber: req.user._id,
        channel: channelId
    })

    if (existingSubscription) {

        await Subscription.findByIdAndDelete(existingSubscription._id)
    }
    else {
        await Subscription.create({
            subscriber: req.user._id,
            channel: channelId
        })
    }

    return res.status(200).json(

})
