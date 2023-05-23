import express from 'express'
import { commentPost, createPost, deletePost, getCommentsPost, getPost, getTimelinePosts, likePost, updatePost } from '../Controllers/PostController.js'
const router = express.Router()

router.post('/create', createPost)
router.get('/:id', getPost)
router.put('/:id', updatePost)
router.delete('/:id', deletePost)
router.put('/:id/like', likePost)
router.get('/:id/comment', getCommentsPost)
router.post('/:id/comment', commentPost)
router.get('/:id/timeline', getTimelinePosts)
export default router