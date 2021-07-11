// loading express
const express = require("express");
const router = express.Router();

// Loading the movies model and its validator
const {Movie, validate} = require("../models/Movie");
const {Genre} = require("../models/Genre");

router.get("/", async (req, res)=>{
    const movies = await Movie.find()
                                .sort({title: 1});
    res.send(movies);
});

router.get("/:id", async (req, res)=>{
    const movie = await Movie.findById(req.params.id);
    if(!movie)
        return res.status(404).send("Movie not found");
    
    res.status(200).send(movie);
});

router.post("/", async (req, res)=>{
    const {error} = validate(req.body);

    if(error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if(!genre) return res.status(400).send("Invalid genre!");

    let movie = new Movie({
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });

    movie = await movie.save();
    res.status(200).send(movie);
});

router.put("/:id", async (req, res)=>{

    let movie = await Movie.findById(req.params.id);
    if(!movie)
        return res.status(404).send("Movie not found");
        
    if(req.body.title)
        movie.title = req.body.title;
    
    if(req.body.genre)
        movie.genre = req.body.genre;

    if(req.body.numberInStock)
        movie.numberInStock = req.body.numberInStock;

    if(req.body.dailyRentalRate)
        movie.dailyRentalRate = req.body.dailyRentalRate;

        
    movie = await movie.save();

    res.status(200).send(movie);
});

router.delete("/:id", async (req, res)=>{

    const movie = await Movie.findByIdAndRemove(req.params.id, {useFindAndModify: false});

    if(!movie) return res.status(code=404).send("Movie unavailable!");

    res.status(200).send(movie);
});


module.exports = router;