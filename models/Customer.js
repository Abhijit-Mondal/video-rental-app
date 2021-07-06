// defining the model for a Customer
const mongoose = require('mongoose');
const {Schema} = mongoose;
// input validation
const Joi = require("joi");

// Schema
const customerSchema = new Schema({
    isGold: {
        type: Boolean,
        default: false,
        required: true
    },
    name: {
        type: String,
        minlength: 5,
        maxlength: 50,
        required: true
    },
    phone: {
        type: String,
        minlength: 5,
        maxlength: 50,
        required: true
    }  
});

// Model
const Customer = mongoose.model("Customer", customerSchema);


// Validator:
const validateCustomer = (customer) => {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        phone: Joi.string().min(5).max(50).required(),
        isGold: Joi.boolean().default(false).required()
    });
    return schema.validate(customer);
};

exports.Customer = Customer;
exports.validate = validateCustomer;