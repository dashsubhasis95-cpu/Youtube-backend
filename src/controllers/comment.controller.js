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

    return res.status(200).json({
        success: true,
        page: Number(page),
        limit: Number(limit),
        totalComments: comments.length,
        comments
    })

})