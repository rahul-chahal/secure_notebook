// import Express.router()
const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const Users = require("../models/Users.js");
const fetchuser = require("../middleware/fetchuser.js");
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
// const mongoserver = require('./db.js')()

//Signup route
router.post('/signup',
    [
        body('email').isEmail().withMessage('Invalid email address'),
        body('name').notEmpty().withMessage('Name is required')
    ],
    async (req, res) => {
        const result = validationResult(req);

        if (!result.isEmpty()) {
            // If there are validation errors, respond with a 400 status and the errors
            return res.status(400).json({ errors: result.array() });
        }
        const { name, email, password } = req.body;
        // res.send(`Hello, ${name}!`);
        const response = await Users.findOne({ email });

        if (!response) {
            const userPassword = req.body.password;
            const salt = await bcrypt.genSalt(10);
            const secPassword = await bcrypt.hash(userPassword, salt)
            const data = new Users({ name: name, email: email, password: secPassword });

            // Attempt to save the user data
            await data.save();
            console.log("User registered:", data);
            return res.status(201).json({ message: "User registered successfully" })
        }
        else {
            return res.status(200).json({ errors: "Email already registered" }); s
        }
    })

// Login route
router.post('/login',
    [
        body('email').isEmail().withMessage('Invalid email address'),
        body('password').notEmpty().withMessage('Password is required')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        else {
            const { email, password } = req.body;
            const user_in_db = await Users.findOne({ email });
            if (user_in_db) {
                console.log("useer is in db"); // Log the request body
                const PasswordCompare = await bcrypt.compare(password, user_in_db.password)
                if (PasswordCompare){
                    // sending signed user-id  from db
                    var token = jwt.sign(user_in_db.id, 'shhhhh');
                    res.status(200).json({authToken:token})
                }
                else{
                    res.status(400).json({mssg:"Use correct Credentials"})
                }

            }
            else{
                res.status(400).json({mssg:"Use correct Credentials"})
            }
        }
        }  
)

// fetching user data using authtoken from header 
// using middleware to retreive user

router.post('/getuser', fetchuser, 
    async (req, res) => {
        res.status(200).json({ user: req.user });
    }
)

module.exports = router
