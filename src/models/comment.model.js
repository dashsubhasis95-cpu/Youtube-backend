import mongoose, {Schema} from "mongoose";

const commentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User", 
        required: true,
        index: true
    },
    video: {
        type: Schema.Types.ObjectId,
        ref: "Video",
        required: true,
        index: true

    },
    text: {
        type: String,
        required: true
    },
    likesCount: { 
        type: Number, 
        default: 0 },
    parentComment: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Comment", default: null
     }, 
  
    isEdited: { 
        type: Boolean, 
        default: false 
    }, 
    isDeleted: { 
        type: Boolean, 
        default: false 
    }, 



}, {timestamps: true})

export const Comment = mongoose.model("Comment", commentSchema)

