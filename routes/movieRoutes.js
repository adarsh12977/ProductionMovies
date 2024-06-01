import express from 'express'
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js'
import { createMovieController, deleteMovieController, getMovieController, getSingleMovieController, moviePhotoController, searchMovieController, updateMovieController } from '../controllers/movieController.js'
import formidable from 'express-formidable'

const router = express.Router()

router.post('/create-movie', requireSignIn, isAdmin, formidable(), createMovieController)
router.put("/update-movie/:pid", requireSignIn, isAdmin, formidable(), updateMovieController)
router.get('/get-movie', getMovieController)
router.get('/get-movie/:slug', getSingleMovieController)
router.get('/movie-photo/:pid', moviePhotoController)
router.delete("/delete-movie/:pid", deleteMovieController);
router.get('/search/:keyword', searchMovieController)

export default router