import express from 'express'
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js'
import { createGenreController, getGenreController } from '../controllers/genreController.js'

const router = express.Router()

router.post('/create-genre', requireSignIn, isAdmin, createGenreController)
router.get('/get-genre', getGenreController)
router.get('/single-genre/:slug')

export default router