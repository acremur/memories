import express from 'express'
import { commentPost, createPost, deletePost, getAllPosts, getPost, getPostsBySearch, likePost, updatePost } from '../controllers/postController.js'
import auth from '../middlewares/auth.js'
const router = express.Router()

router.get('/', getAllPosts)
router.get('/search', getPostsBySearch)
router.get('/:id', getPost)
router.post('/', auth, createPost)
router.patch('/:id', auth, updatePost)
router.delete('/:id', auth, deletePost)
router.patch('/:id/like', auth, likePost)
router.post('/:id/comment', auth, commentPost)

export default router