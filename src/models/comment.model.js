import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const commentSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User", 
        // required: true,
        // index: true
    },
    video: {
        type: Schema.Types.ObjectId,
        ref: "Video",
        // required: true,
        // index: true

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
    content: {
        type: String,
        required: true
    }



}, {timestamps: true})

commentSchema.plugin(mongooseAggregatePaginate)

export const Comment = mongoose.model("Comment", commentSchema)

