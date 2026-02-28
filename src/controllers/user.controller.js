import { asyncHandler } from "../utils/asyncHandler.js";
import { User} from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadonCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshTokens = async(userId) =>  {
    try{
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
    }

}

const registerUser = asyncHandler( async (req, res) => {
    const {fullName, username, email, password} = req.body
    console.log("email: ", email)
    if([fullName, username, email, password].some((field) => field?.trim() === ""  )){
        throw new ApiError(400,"All fields are required")
    }
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })
    if(existedUser){
        throw new ApiError(409  , "User already exists with this email or username")
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path
    // const coverImageLocalPath = req.files?.coverImage[0]?.path
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files.coverImage[0].path
    }
    console.log(req.files)

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar image is required")
    }
    const avatar = await uploadonCloudinary(avatarLocalPath)
    // const coverImage =  await uploadonCloudinary(coverImageLocalPath) 
    let coverImage = ""

 if (coverImageLocalPath) {
    const uploadedCover = await uploadonCloudinary(coverImageLocalPath)
    coverImage = uploadedCover?.url || ""
}

    if (!avatar) {
        throw new ApiError(500, "Failed to upload avatar image")
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage.url || "",
        email,
        password,
        username: username.toLowerCase()

    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")
    if (!createdUser) {
        throw new ApiError(500, "Failed to create user")
    }


    return res.status(201).json(new ApiResponse(200, createdUser, "User registered successfully"))





   


})

const loginUser = asyncHandler( async (req, res) => {
    const { email, username, password} = req.body

    if(!username || !email){
        throw new ApiError(400, "Username or email are required")
    }

    const user = await User.findOne({
        $or: [{username},{email}]
    })
    if(!user){
        throw new ApiError(404, "User not found with this email or username")
    }
    const isPasswordValid = await user.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new ApiError(401, "Invalid user credentials")
    }
    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)
    
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200).cookie("accessToken", accessToken , options).cookie("refreshToken", refreshToken, options).json(new ApiResponse(200, {
        user: loggedInUser , accessToken , refreshToken
    }, "User logged in successfully"))



})

const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken : undefined
            }
        },
        {
            new: true
        }

    )
    const options = {
        httpOnly: true,
        secure: true
    }
    return res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken", options).json(new ApiResponse(200, {}, "User logged out successfully"))

})
export { 
    registerUser,
    loginUser,
    logoutUser
}

