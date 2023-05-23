import mongoose from 'mongoose';
const CommentSchema = mongoose.Schema(
    {
        userId: String,
        postId: String,
        comment: String
    }, {
    timestamps: true
}
)
const commentModel = mongoose.model('Comment', CommentSchema)
export default commentModel