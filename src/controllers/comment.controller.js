const getVideoComments = asyncHandler(async (req, res) => {

    const { videoId } = req.params
    const { page = 1, limit = 10 } = req.query

    const skip = (Number(page) - 1) * Number(limit)

    const comments = await Comment.aggregate([

        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId),
                parentComment: null,
                isDeleted: false
            }
        },

        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fullName: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },

        {
            $unwind: "$owner"
        },

        {
            $lookup: {
                from: "comments",
                let: { commentId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$parentComment", "$$commentId"]
                            },
                            isDeleted: false
                        }
                    },

                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        username: 1,
                                        fullName: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },

                    {
                        $unwind: "$owner"
                    },

                    {
                        $sort: { createdAt: -1 }
                    }

                ],
                as: "replies"
            }
        },

        {
            $sort: { createdAt: -1 }
        },

        {
            $skip: skip
        },

        {
            $limit: Number(limit)
        }

    ])

    return res.status(200).json(
        new ApiResponse(200, comments, "Comments fetched successfully")
    )

})


const addComment = asyncHandler(async (req, res) => {

    const { videoId } = req.params
    const { content, parentComment } = req.body

    if (!content || content.trim() === "") {
        throw new ApiError(400, "Comment content is required")
    }

    // check video exists
    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    const newComment = await Comment.create({
        content: content.trim(),
        video: videoId,
        owner: req.user._id,
        parentComment: parentComment || null
    })

    return res.status(201).json(
        new ApiResponse(
            201,
            newComment,
            "Comment added successfully"
        )
    )
})