import userModel from '../Models/userModel.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import postModel from '../Models/postModel.js'

export const getUser = async (req, res) => {
    const id = req.params.id
    try {
        const user = await userModel.findById(id)
        const { password, isAdmin, ...otherDetails } = user._doc

        /**
         * followers
         */
        const followers = await userModel.find({ _id: { $in: user.followers } }, {
            _id: 1, firstName: 1, lastName: 1, profilePicture: 1
        })

        /**
         *  following
         */

        const following = await userModel.find({ _id: { $in: user.following } }, {
            _id: 1, firstName: 1, lastName: 1, profilePicture: 1
        })


        otherDetails.followers = followers
        otherDetails.following = following


        const timlinePost = await postModel.find({
            userId: id,
        })
        otherDetails.timlinePost = timlinePost.sort((a, b) => {
            return b.createdAt - a.createdAt
        })

        if (user) {
            res.status(200).json(otherDetails)
        } else {
            res.status(404).json("User does not exist")
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// update a user
export const updateUser = async (req, res) => {
    const id = req.params.id
    const { currentUserId, currentUserAdminStatus, password } = req.body

    if (id === currentUserId) {
        if (password) {
            const salt = await bcrypt.genSalt(10)
            req.body.password = await bcrypt.hash(password, salt)
        }
        try {
            const user = await userModel.findByIdAndUpdate(id, req.body, { new: true })
            res.status(200).json(user)
        } catch (error) {
            res.status(500).json(error)
        }
    } else {
        res.status(403).json("Access Denied! You can only update your own profile")
    }

}

//delete user
export const deleteUser = async (req, res) => {
    const id = req.params.id
    const { currentUserId, currentUserAdminStatus } = req.body

    if (id === currentUserId) {
        try {
            await userModel.findByIdAndDelete(id)
            res.status(200).json('user deleted!')
        } catch (error) {
            res.status(500).json(error)
        }

    } else {
        res.status(403).json('Access Denied!')
    }
}

// follow User
export const followUser = async (req, res) => {
    const id = req.params.id
    const { currentUserId } = req.body
    if (id === currentUserId) {
        res.status(403).json("Action forbidden!")
    } else {
        try {
            const followUser = await userModel.findById(id)
            const followingUser = await userModel.findById(currentUserId)
            if (!followUser.followers.includes(currentUserId)) {
                await followUser.updateOne({ $push: { followers: currentUserId } })
                await followingUser.updateOne({ $push: { following: id } })
                res.status(200).json('followed')
            } else {
                await followUser.updateOne({ $pull: { followers: currentUserId } })
                await followingUser.updateOne({ $pull: { following: id } })
                res.status(200).json('unfollowed')
            }
        } catch (error) {
            res.status(500).json(error)
        }
    }
}

export const getAllUsers = async (req, res) => {
    try {
        let users = await userModel.find()
        users = users.map(user => {
            const { password, ...otherDetails } = user._doc
            return otherDetails
        })
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json(error)
    }
}

export const findUsers = async (req, res) => {
    const key = req.params.key
    try {
        let results = await userModel.find({
            $or: [
                { userName: { $regex: new RegExp(key, 'i') } },
                { firstName: { $regex: new RegExp(key, 'i') } },
                { lastName: { $regex: new RegExp(key, 'i') } }
            ]
        }).limit(5)
        results = results.map(user => {
            const { firstName, lastName, profilePicture, _id } = user._doc
            return {
                _id: _id,
                userName: lastName + ' ' + firstName,
                profilePicture: profilePicture,
            }
        })
        res.status(200).json(results)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}
