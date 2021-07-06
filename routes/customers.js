const express = require("express");
const router = express.Router();

// Loading the customer model and its validator:
const {Customer, validate} = require("../models/Customer");


router.get("/", async (req, res)=>{
    const customers = await Customer.find().sort({name:1});
    res.send(customers);
});

router.get("/:id", async (req, res)=>{
    const customer = await Customer.findById(req.params.id);
    if(!customer)
        return res.status(404).send("Customer not found");
    
    res.status(200).send(customer);
});

router.post("/", async (req, res)=>{
    const {error} = validate(req.body);

    if(error) return res.status(400).send(error.details[0].message);

    let customer = new Customer({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    });

    customer = await customer.save();
    res.status(200).send(customer);
});

router.put("/:id", async (req, res)=>{

    const {error} = validate(req.body);

    if (error) return res.status(code=400).send(error.details[0].message);


    const customer = await Customer.findByIdAndUpdate(req.params.id, 
        {name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold}, 
        {new: true,
        useFindAndModify: false});


    if(!customer) return res.status(code=404).send("Customer unavailable!");


    res.status(200).send(customer);
});

router.delete("/:id", async (req, res)=>{

    const customer = await Customer.findByIdAndRemove(req.params.id,{useFindAndModify: false});

    if(!customer) return res.status(code=404).send("Customer unavailable!");

    res.status(200).send(customer);
});


module.exports = router;