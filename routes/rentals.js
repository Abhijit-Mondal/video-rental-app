// loading express
const express = require("express");
const Router = express.Router();

// loading the Rental model and its validator
const {Rental, validate} = require("../models/Rental");
// loading the Movie model
const {Movie} = require("../models/Movie");
// loading the Customer model
const {Customer} = require("../models/Customer");


// loading database orm module
const mongoose = require("mongoose");

// loading fawn module for handling transactions ( two phase commit )
const Fawn = require("fawn");
Fawn.init(mongoose);


// Route handlers

router.get("/", async (req, res)=>{
    const rentals = await Rental.find().sort('-dateOut');
    res.send(rentals);
});

router.post("/", async (req, res)=>{
    const {error} = validate(req.body);
    
    if(error) 
        return res.status(400).send(error.details[0].message);
    
    const customer = await Customer.findById(req.body.customerId);
    if(!customer)
        return res.status(400).send("Invalid Customer!");
    
    const movie = await Movie.findById(req.body.movieId);
    if(!movie)
        return res.status(400).send("Invalid Movie!");

    if(movie.numberInStock === 0)
        return res.status(400).send("Movie not in stock!");

    let rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    });
    // rental = await rental.save();

    // movie.numberInStock--;
    // movie.save();


    new Fawn.Task()
        .save("rentals", rental)
        .update("movies", {_id: movie._id}, {
            $inc: {
                numberInStock: -1
            }
        })
        .run()
        .then(()=>{dbDebugger("Rental Operation Successful!")})
        .catch((err)=>{
            dbDebugger(err);
            return res.status(500).send("Rental Operation Failed");
        });

    res.send(rental);
});

module.exports = Router;