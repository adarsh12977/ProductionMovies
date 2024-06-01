import { comparePassword, hashPassword } from "../helpers/authHelper.js"
import userModel from "../models/userModel.js"
import JWT from 'jsonwebtoken'

export const registerController = async (req,res) => {
    try {
        const {name,email,password} = req.body
        if(!name){
            return res.send({message: 'Name is required'})
        }
        if(!email){
            return res.send({message: 'Email is required'})
        }
        if(!password){
            return res.send({message: 'Password is required'})
        }
        const existingUser = await userModel.findOne({email})
        if(existingUser){
            return res.status(200).send({
                success: false,
                message: 'User already exists'
            })
        }
        const hashedPassword = await hashPassword(password)
        const user = await new userModel({name,email,password:hashedPassword}).save()
        res.status(200).send({
            success: true,
            message: 'User registered successfully',
            user
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error in registration callback',
            error
        })
    }
}

export const loginController = async (req,res) => {
    try {
        const {email,password} = req.body
        if(!email || !password){
            return res.status(404).send({
                success: false,
                message: 'Invalid email or password'
            })
        }
        const user = await userModel.findOne({email})
        if(!user){
            return res.status(404).send({
                success: false,
                message: 'User has not registered'
            })
        }
        const match = await comparePassword(password, user.password)
        if(!match){
            return res.status(200).send({
                success: false,
                message: 'Invalid password'
            })
        }
        const token = await JWT.sign({_id:user._id}, process.env.JWT_SECRET, {expiresIn:'7d'})
        res.status(200).send({
            success: true,
            message: 'Logged in successfully',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error in login callback',
            error
        })
    }
}
