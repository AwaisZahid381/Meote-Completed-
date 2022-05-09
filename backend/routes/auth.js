// exporting the express.js
const express = require("express");

// importing express-validator for checking the data that is being sent before sending it
const { body, validationResult } = require("express-validator");

// here we are importing our user models according to which our data will be sent to the Database
const User = require("../models/User");

// This one is madnatory to put the routrers on board
const router = express.Router();

// importing the hashing and salting modules
const bcrypt = require("bcryptjs");

// it is a expres js module which is used to authenticate the user
const jwt = require("jsonwebtoken");

const JWT_SECRET = "Awais is a quick learner";

const fetchuser = require("../middleware/fetchuser")

// Create a user using: POST "api/auth". Doesn't require authentication no login required
// Don't use get this will the all the details that is being sent to database in the URL
//ROUTE : 1 localhost:5000/api/auth/createUser
router.post(
  // name of the request that is being sent
  "/createUser",
  // Elements in form af array being sent to database
  [
    body("name", "Enter a Valid Name").isLength({ min: 3 }),
    body("email", "Enter a Valid Email").isEmail(),
    body("password", "Password must be Five Characters long").isLength({
      min: 5,
    }),
  ],
  // this is a async request which will wait for the promises of being done
  async (req, res) => {
    let success = false
    // if there are error return bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // 400 means a bad requested in posted
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      //check whether the user exist with the same email
      let user = await User.findOne({ email: req.body.email });

      // if someone tries to make the user which email is already taken then it will notify it
      if (user) {
        return res
          .status(400)
          .json({ errors: "Sorry this email is already taken " });
      }

      //using the bcrypt functions
      const salt = await bcrypt.genSalt(10);

      // variable to make the secure password for hashing
      const secPass = await bcrypt.hash(req.body.password, salt);

      // if the email is not taken then it will create the new user and the data will be sent to the databse
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      // if everything is perfect and undercontrol then it will give this response.
      res.json({success:true, authtoken });
    } catch (error) {
      // if there an error occurs in that case it will show below things
      console.error(error);
      res.status(500).send(`Some Error occured, ${success = false}`);
    }
  }
);

//Authenticate a user using the post
//ROUTE : 2 localhost:5000/api/auth/login
router.post(
  // name of the request that is being sent
  "/login",
  // Elements in form af array being sent to database
  [body("email", "Enter a Valid Email").isEmail()],
  [body("password", "Password cannot be blanked").exists()],

  async (req, res) => {
    let success = false
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // 400 means a bad requested in posted
      return res.status(400).json({ errors: errors.array() });
    }

    const {email,password} = req.body
    try {
        let user = await User.findOne({email})
        if(!user){
          return res.status(400).json({error:"Please enter correct credentials"})
        }
        const passwordCompare = await bcrypt.compare(password,user.password)
        if(!passwordCompare){
          return res.status(400).json({error:"Please enter correct credentials"})
        }
        const data = {
          user:{
            id: user.id
          }
        }
        const authtoken = jwt.sign(data,JWT_SECRET)
        res.json({success:true,authtoken})

    } catch (error) {
      console.error(error);
      res.status(500).send(`Some interal server error occured ${success = false}`);
    }
  }

);

//get logged in user details 
//ROUTE : 3 localhost:5000/api/auth/getUser
router.post(
  // name of the request that is being sent
  "/getuser",
  fetchuser,
  async (req, res) => {
try {
  userId= req.user.id;
  const user = await User.findById(userId).select("-password")
  res.send(user)
} catch (error) {
  console.error(error);
  res.status(500).send("Some interal server error occured");
}
  })
// this is madnatory otherwise the app will crash
module.exports = router;
