import express from "express";
const router = express.Router()
import { deleteUser, findUsers, followUser, getAllUsers, getUser, updateUser} from "../Controllers/UserController.js";

router.get('/:id', getUser)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)
router.put('/:id/follow', followUser)
router.get('/', getAllUsers)
router.get('/search/:key', findUsers)
export default router
