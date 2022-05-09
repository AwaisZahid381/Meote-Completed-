const jwt = require("jsonwebtoken"); //importing the jsonwebtoken
//importing the JWT_SECRET created in auth.js 
const JWT_SECRET = "Awais is a quick learner";

//function for fetching the user data
//here the next is used and denoted for the middleware functions
const fetchuser = (req,res,next)=>{
    const token = req.header('auth-token')
    if(!token){
        res.status(401).send({error:"please authenticate using a valid token"})
    }
    try {
        const data = jwt.verify(token,JWT_SECRET)
        req.user = data.user    
    } catch (error) {
        res.status(401).send({error:"please authenticate using a valid token"})
    }
    //get the user from the jwt token and add id to request
    next()
}

module.exports = fetchuser