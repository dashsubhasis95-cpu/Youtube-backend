import { Video } from "../models/video.model"

const getAllVideos = asyncHandler(async (req, res) => {

  const { page = 1, limit = 10, query, sortBy , sortType , userId } = req.query

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

  return res.status(200).json(
    new ApiResponse(200, videos, "Videos fetched successfully")
   )
})

const publishAVideo = asyncHandler(async (req, res) => {
    const {videoId}= req.params
    const { title, description, thumbnail, videoUrl } = req.body
    const video = await Video.findByIdAndUpdate(
        videoId,
        { title, description, thumbnail, videoUrl, isPublished: true },
        { new: true }
    )
    return res.status(200).json(
        new ApiResponse(200, video, "Video published successfully")
    )
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const video = await Video.find(videoId)

    return res.status(200).json(
      new ApiResponse(200, video, "Video fetched successfully")
    )

})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { title, description, thumbnail, videoUrl } = req.body
    const video = await Video.findByIdAndUpdate(
        videoId,
        { title, description, thumbnail, videoUrl },
        { new: true }
    )
    return res.status(200).json(
        new ApiResponse(200, video, "Video updated successfully")
    )

})