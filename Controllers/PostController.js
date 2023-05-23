import mongoose from 'mongoose';
import postModel from '../Models/postModel.js'
import userModel from '../Models/userModel.js'
import commentModel from '../Models/CommentModel.js';
// create new post
export const createPost = async (req, res) => {

    const { lastName, firstName } = await userModel.findById(req.body.userId)
    const newPost = new postModel({ ...req.body, userName: `${lastName} ${firstName}` })
    try {
        await newPost.save();
        res.status(200).json(newPost)
    } catch (error) {
        res.status(500).json(error)
    }
}
// get a post
export const getPost = async (req, res) => {
    const id = req.params.id
    try {
        const post = await postModel.findById(id)
        res.status(200).json(post)
    } catch (error) {
        res.status(500).json(error)
    }
}

// update post
export const updatePost = async (req, res) => {
    const id = req.params.id
    const { currentUserId } = req.body
    try {
        const post = await postModel.findById(id)
        if (currentUserId === post.userId) {
            await post.updateOne({ $set: req.body })
            res.status(200).json('Post updated successfully')
        } else {
            res.status(403).json("Action forbidden!")
        }

    } catch (error) {
        res.status(500).json(error)
    }
}
// delete post 

export const deletePost = async (req, res) => {
    const id = req.params.id
    const { currentUserId } = req.body

    try {
        const post = await postModel.findById(id)
        if (post.userId === currentUserId) {
            await post.deleteOne()
            res.status(200).json("Post deleted successfully")
        } else {
            res.status(434).json("Action forbidden")
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

//like post
export const likePost = async (req, res) => {
    const id = req.params.id
    const { currentUserId } = req.body
    try {
        const post = await postModel.findById(id)
        if (!post.likes.includes(currentUserId)) {
            await post.updateOne({ $push: { likes: currentUserId } })
            res.status(200).json("liked!")
        } else {
            await post.updateOne({ $pull: { likes: currentUserId } })
            res.status(200).json("disliked!")
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

// comment post
export const commentPost = async (req, res) => {

    const postId = req.params.id
    try {
        const comment = new commentModel({ ...req.body, postId: postId })
        await comment.save()
        await postModel.updateOne({ _id: postId }, { $push: { comment: comment._id } })
        res.status(200).json(comment)
    } catch (error) {
        res.status(500).json(error)
    }
}

//get comments post 
export const getCommentsPost = async (req, res) => {
    const postId = req.params.id
    try {
        const comments = await commentModel.aggregate([
            {
                $match: {
                    postId: postId,
                }
            }, {
                $addFields: {
                    'userObjectId': { $toObjectId: '$userId' }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: 'userObjectId',
                    foreignField: "_id",
                    as: 'user'
                }
            }, {
                $unwind: '$user'
            }, {
                $project: {
                    _id: 1,
                    userId: 1,
                    comment: 1,
                    createdAt: 1,
                    lastName: '$user.lastName',
                    firstName: '$user.firstName',
                    profilePicture: '$user.profilePicture'
                }
            },
        ])

        res.status(200).json(comments)
    } catch (error) {
        res.status(500).json(error)
    }
}

//  2nd method to getCommentsPost 
/*
                $lookup: {
                    let: { 'userObjectId': { $toObjectId: '$userId' } },
                    from: "users",
                    pipeline: [
                        {
                            $addFields: {
                                'userObjectId': '$userObjectId'
                            }
                        },
                        {
                            $match: {
                                $expr: { $eq: ['$_id', '$$userObjectId'] }
                            }
                        }, {
                            $project: {
                                _id: 0,
                                firstName: 1,
                                lastName: 1,
                                profilePicture: 1
                            }
                        }
                    ],

                    as: 'user'
                }
            }, {
                $unwind: '$user'
            }, {
                $project: {
                    _id: 1,
                    userId: 1,
                    comment: 1,
                    createAt: 1,
                    lastName: '$user.lastName',
                    firstName: '$user.firstName',
                    profilePicture: '$user.profilePicture'
                }
            },
        ])
*/

// get timelinePosts

export const getTimelinePosts = async (req, res) => {
    const currentUserId = req.params.id
    try {
        const currentUserPosts = await postModel.find({ userId: currentUserId })
        const followingPosts = await userModel.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(currentUserId)
                }
            },
            {
                $lookup: {
                    from: "posts",
                    localField: 'following',
                    foreignField: "userId",
                    as: 'followingPosts'
                }
            },
            {
                $project: {
                    followingPosts: 1,
                    _id: 0
                }
            }
        ])

        let posts = currentUserPosts.concat(...followingPosts[0].followingPosts)
        res.status(200)
            .json(posts
                .sort((a, b) => {
                    return b.createdAt - a.createdAt
                })
            )
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
}
