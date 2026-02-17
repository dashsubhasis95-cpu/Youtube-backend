import { asyncHandler } from "../utils/asyncHandler.js";
import { User} from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadonCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


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

    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path
    // console.log(req.files)

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar image is required")
    }
    const avatar = await uploadonCloudinary(avatarLocalPath)
    const coverImage =  await uploadonCloudinary(coverImageLocalPath) 

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



export {registerUser}

