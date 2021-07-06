// defining the model for a Genre
const mongoose = require("mongoose");
const {Schema} = mongoose;
// input validation
const Joi = require("joi");

// Schema
const genreSchema = new Schema({
    name: {
            type: String,
            required:true,
            minlength: 5,
            maxlength: 50
        }
});

// Model:
const Genre = mongoose.model("Genre", genreSchema);

// Validator:
const validateGenre = (genre) => {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required()
    });
    return schema.validate(genre);
};


exports.Genre = Genre;
exports.validate = validateGenre;