// defining the model for a Movie
const mongoose = require("mongoose");
const {Schema} = mongoose;
// input validation
const Joi = require("joi");


const {genreSchema} = require("./Genre");

// Schema
const movieSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength:255
    },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    dailyRentalRate: {
        type: Number,
        require: true,
        min: 0,
        max: 255
    }
});


// Model: 
const Movie = mongoose.model("Movie", movieSchema);

//Validator:
const validateMovie = (movie) => {
    const schema = Joi.object({
        title: Joi.string().min(5).max(50).required(),
        genreId: Joi.string().required(),
        numberInStock: Joi.number().min(0).required(),
        dailyRentalRate: Joi.number().min(0).required()
    });
    return schema.validate(movie);
};

exports.Movie = Movie;
exports.validate = validateMovie;