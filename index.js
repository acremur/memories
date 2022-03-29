import dotenv from 'dotenv'
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import postRoutes from './routes/posts.js'
import usersRoutes from './routes/users.js'
const app = express()
dotenv.config()

app.use(express.json({ limit: "30mb", extended: true }))
app.use(express.urlencoded({ limit: "30mb", extended: true }))
app.use(cors())

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    const port = process.env.PORT || 8000
    app.listen(port, () => console.log(`Node JS Server running on port ${port}`))
    console.log('Connected to MongoDB memories database')
})
.catch(error => console.log(error))

app.use('/api/posts', postRoutes)
app.use('/api/users', usersRoutes)
// app.use('/', (req, res) => res.send('APP IS RUNNING'))

const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use('/', express.static(path.join(__dirname, './client/build')))
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './client/build/index.html'))
})