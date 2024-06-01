import mongoose from 'mongoose'

const movieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    genre: {
        type: mongoose.ObjectId,
        ref: 'Genre',
        required: true
    },
    photo: {
        data: Buffer,
        contentType: String
    }
}, {timestamps:true})

export default mongoose.model('Movies', movieSchema)