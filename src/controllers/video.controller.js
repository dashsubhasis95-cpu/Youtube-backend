const getAllVideos = asyncHandler(async (req, res) => {

  const { page = 1, limit = 10, query, sortBy = "createdAt", sortType = -1, userId } = req.query

  const filter = {
    isPublished: true
  }

  if (userId) {
    filter.owner = userId
  }

  if (query) {
    filter.title = { $regex: query, $options: "i" }
  }

  const videos = await Video.find(filter)
    .sort({ [sortBy]: sortType })
    .skip((page - 1) * limit)
    .limit(Number(limit))

  res.status(200).json({
    status: "success",
    message: "Videos fetched successfully",
    data: videos
  })
})