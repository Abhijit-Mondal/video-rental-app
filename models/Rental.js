// defining the model for a Rental
const mongoose = require("mongoose");
const {Schema} = mongoose;
// input validation
const Joi = require("joi");

// Schema
const rentalSchema = new Schema({
    customer: {
        type: new Schema({
            name: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 50
            },
            isGold: {
                type: Boolean,
                default: false
            },
            phone: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 50
            }
        }),
        required: true
    },
    movie: {
        type: new Schema({
            title: {
                type: String,
                required: true,
                trim: true,
                maxlength:255
            },
            dailyRentalRate: {
                type: Number,
                require: true,
                min: 0,
                max: 255
            }
        }),
        required: true
    },
    dateOut: {
        type: Date,
        required: true,
        default: Date.now
    },
    dateReturned: {
        type: Date
    },
    rentalFee: {
        type: Number,
        min: 0
    }
});

// Model: 
const Rental = mongoose.model("Rental", rentalSchema);

//Validator:
const validateRental = (rental)=>{
    const schema = Joi.object({
        customerId: Joi.string().required(),
        movieId: Joi.string().required()
    });
    return schema.validate(movie);
};

exports.Rental = Rental;
exports.validate = validateRental;