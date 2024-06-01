import genreModel from "../models/genreModel.js"
import slugify from "slugify"

export const createGenreController = async (req,res) => {
    try {
        const {name} = req.body 
        if(!name){
            return res.status(401).send({message: 'Name is required'})
        }
        const existingGenre = await genreModel.findOne({name})
        if(existingGenre){
            return res.status(200).send({
                success: false,
                message: 'Genre already exists'
            })
        }
        const genre = await new genreModel({name, slug:slugify(name)}).save()
        res.status(201).send({
            success: true,
            message: 'New genre created',
            genre
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error in create genre callback',
            error
        })
    }
}

export const getGenreController = async (req,res) => {
    try {
        const genre = await genreModel.find({})
        res.status(200).send({
            success: true,
            message: 'All genres list',
            genre
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error in get genre callback',
            error
        })
    }
}

export const getSingleGenreController = async (req,res) => {
    try {
        const genre = await genreModel.findOne({slug:req.params.slug})
        res.status(200).send({
            success: true,
            message: 'Single genre got successfully',
            genre
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error in get single genre callback',
            error
        })
    }
}