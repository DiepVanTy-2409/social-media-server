import mongoose from "mongoose";

const postSchema = mongoose.Schema(
    {
        userId: {
            type: String,
            required: true
        },
        userName: String,
        desc: String,
        likes: [],
        comment: [],
        shares: [],
        image: String
    }, {
    timestamps: true
}
)
const postModel = mongoose.model("post", postSchema)
export default postModel