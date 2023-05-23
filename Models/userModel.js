import mongoose from 'mongoose'

const userSchema = mongoose.Schema(
    {
        userName: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        profilePicture: String,
        coverPicture: String,
        about: String,
        liveIn: String,
        workAt: String,
        relationship: String,
        // friends: [],
        followers: [],
        following: [],
    },
    { timestamps: true }
)



const userModel = mongoose.model('Users', userSchema)
export default userModel