import mongoose from 'mongoose'
import Post from '../models/Post.js'

export const getAllPosts = async (req, res) => {
    try {
        const { page } = req.query

        const LIMIT = 4
        const startIndex = (Number(page) - 1) * LIMIT
        const total = await Post.countDocuments()

        const posts = await Post.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex)
        res.status(200).json({
            posts,
            currentPage: Number(page),
            numberOfPages: Math.ceil(total / LIMIT)
        })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

export const getPost = async (req, res) => {
    try {
        const { id } = req.params

        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(404).send('No post with that id') 

        const post = await Post.findById(id)
        res.status(200).json(post)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

export const getPostsBySearch = async (req, res) => {
    try {
        const { q, tags } = req.query

        const title = new RegExp(q, 'i')
        const posts = await Post.find({ $or: [{ title }, { tags: { $in: tags.split(',') } }] })
        res.status(200).json(posts)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

export const createPost = async (req, res) => {
    try {
        const newPost = await Post.create({ ...req.body, creator: req.userId })
        res.status(201).json(newPost)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const updatePost = async (req, res) => {    
    try {
        const { id: _id } = req.params

        if (!mongoose.Types.ObjectId.isValid(_id))
            return res.status(404).send('No post with that id') 
        
        const updatedPost = await Post.findByIdAndUpdate(_id, req.body, { new: true })
        res.json(updatedPost)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const deletePost = async (req, res) => {    
    try {
        const { id } = req.params

        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(404).send('No post with that id') 
        
        await Post.findByIdAndRemove(id)
        res.json({ message: 'Post deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const likePost = async (req, res) => {    
    try {
        const { id } = req.params

        if (!req.userId) 
            return res.status(401).json({ message: 'Unauthenticated' })

        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(404).send('No post with that id') 
        
        const post = await Post.findById(id)

        const index = post.likes.findIndex(id => id === String(req.userId))

        if (index === -1) {
            post.likes.push(req.userId)
        } else {
            post.likes = post.likes.filter(id => id !== String(req.userId))

        }
        
        const updatedPost = await Post.findByIdAndUpdate(id, post, { new: true })
        res.json(updatedPost)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const commentPost = async (req, res) => {    
    try {
        const { id } = req.params
        const { value } = req.body

        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(404).send('No post with that id') 

        const post = await Post.findById(id)
        post.comments.push(value)
        const updatedPost = await Post.findByIdAndUpdate(id, post, { new: true })
        res.json(updatedPost)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}