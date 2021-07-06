//loading express
const express = require("express");
const router = express.Router();

// Loading the genres model and its validator:
const {Genre, validate} = require("../models/Genre");

router.get("/", async (req, res)=>{
    const genres = await Genre.find().sort({name:1});
    res.send(genres);
});

router.get("/:id", async (req, res)=>{
    const genre = await Genre.findById(req.params.id);
    if(!genre)
        return res.status(404).send("Genre not found");
    
    res.status(200).send(genre);
});

router.post("/", async (req, res)=>{
    const {error} = validate(req.body);

    if(error) return res.status(400).send(error.details[0].message);

    let genre = new Genre({
        name: req.body.name
    });

    genre = await genre.save();
    res.status(200).send(genre);
});

router.put("/:id", async (req, res)=>{

    const {error} = validate(req.body);

    if (error) return res.status(code=400).send(error.details[0].message);


    const genre = await Genre.findByIdAndUpdate(req.params.id, 
        {name: req.body.name}, 
        {new: true,
        useFindAndModify: false});


    if(!genre) return res.status(code=404).send("Genre unavailable!");


    res.status(200).send(genre);
});

router.delete("/:id", async (req, res)=>{

    const genre = await Genre.findByIdAndRemove(req.params.id,{useFindAndModify: false});

    if(!genre) return res.status(code=404).send("Genre unavailable!");

    res.status(200).send(genre);
});

module.exports = router;