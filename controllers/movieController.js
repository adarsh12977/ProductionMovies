import movieModel from "../models/movieModel.js"
import fs from 'fs'
import slugify from "slugify"

export const createMovieController = async (req,res) => {
    try {
        const {name,slug,description,genre} = req.fields
        const {photo} = req.files
        switch(true){
            case !name:
                return res.status(500).send({error:'Name is required'})
            case !description:
                return res.status(500).send({error:'Description is required'})
            case !genre:
                return res.status(500).send({error:'Genre is required'})
            case photo && photo>1000000:
                return res.status(500).send({error:'Photo is required and size should be less than 1mb'})
        }
        const movies = new movieModel({...req.fields, slug:slugify(name)})
        if(photo){
            movies.photo.data = fs.readFileSync(photo.path)
            movies.photo.contentType = photo.type
        }
        await movies.save()
        res.status(201).send({
            success: true,
            message: 'Movie created successfully',
            movies
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error in create movie callback',
            error
        })
    }
}

export const getMovieController = async (req,res) => {
    try {
        const movies = await movieModel.find({}).populate('genre').select('-photo').limit(12).sort({createdAt:-1})
        res.status(200).send({
            success: true,
            countTotal: movies.length,
            message: 'All movies got successfully',
            movies
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error in get movies callback',
            error
        })
    }
}

export const getSingleMovieController = async (req,res) => {
    try {
        const movie = await movieModel.findOne({slug:req.params.slug}).select('-photo').populate('genre')
        res.status(200).send({
            success: true,
            message: 'Single movie got successfully',
            movie
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error in get single movie callback',
            error
        })
    }
}

export const moviePhotoController = async (req,res) => {
    try {
        const movie = await movieModel.findById(req.params.pid).select('photo')
        if(movie.photo.data){
            res.set('Content-type', movie.photo.contentType)
            return res.status(200).send(movie.photo.data)
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error in get photo callback',
            error
        })
    }
}

export const deleteMovieController = async (req, res) => {
    try {
      await movieModel.findByIdAndDelete(req.params.pid).select("-photo");
      res.status(200).send({
        success: true,
        message: "Movie Deleted successfully",
      })
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error while deleting movie",
        error
      })
    }
  }

  export const updateMovieController = async (req, res) => {
    try {
      const { name, description, genre } = req.fields
      const { photo } = req.files;
      switch (true) {
        case !name:
          return res.status(500).send({ error: "Name is Required" });
        case !description:
          return res.status(500).send({ error: "Description is Required" });
        case !genre:
          return res.status(500).send({ error: "Genre is Required" });
        case photo && photo.size > 1000000:
          return res.status(500).send({ error: "Photo is Required and size should be less than 1mb" })
      }
  
      const movies = await movieModel.findByIdAndUpdate(req.params.pid,{ ...req.fields, slug: slugify(name) },{ new: true })
      if (photo) {
        products.photo.data = fs.readFileSync(photo.path);
        products.photo.contentType = photo.type;
      }
      await movies.save();
      res.status(201).send({
        success: true,
        message: "Movie Updated Successfully",
        movies,
      })
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        error,
        message: "Error in update movie callback",
      })
    }
  }

  export const searchMovieController = async (req,res) => {
    try {
      const {keyword} = req.params
      const results = await movieModel.find({
        $or: [
          {name:{$regex:keyword, $options:'i'}},
          {description:{$regex:keyword, $options:'i'}}
        ]
      }).select('-photo')
      res.json(results)
    } catch (error) {
      console.log(error)
      res.status(400).send({
        success: false,
        message: 'Error in search movies callback',
        error
      })
    }
  }