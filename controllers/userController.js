import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const signin = async (req, res) => {
    try {
        const { email, password } = req.body
        const existingUser = await User.findOne({ email })

        if (!existingUser) {
            return res.status(404).json({ message: "User doesn't exist" })
        }

        const isPasswordCorrent = await bcrypt.compare(password, existingUser.password)

        if (!isPasswordCorrent) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        const token = jwt.sign({ 
            email: existingUser.email,
            id: existingUser._id,
        }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        })

        res.status(200).json({ userData: existingUser, token })
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' })
    }
}

export const signup = async (req, res) => {
    try {
        const { email, firstName, lastName, password, confirmPassword } = req.body
        const existingUser = await User.findOne({ email })

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" })
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords don't match" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await User.create({ 
            name: `${firstName} ${lastName}`,
            email, 
            password: hashedPassword
        })

        const token = jwt.sign({ 
            email: newUser.email,
            id: newUser._id,
        }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        })
        
        res.status(201).json({ userData: newUser, token })
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' })
    }
}