var jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Users = require("../models/Users.js");

const fetchuser = async (req, res, next)=>{
    
    if(!req.header('authtokenheader')){
        res.status(401).json({err:"Could not get Authtoken"})
    }
    else{
        try{
            var decodeduserid = jwt.verify(req.header('authtokenheader'), 'shhhhh');
            const objectId = new mongoose.Types.ObjectId(decodeduserid);
            const user_in_db = await Users.findById(objectId).select('-password');
            req.user = user_in_db; 
            next()
        }
        catch(error){
            res.status(401).json({err:"Problem with Authtoken"})
        }
    }

    
}
module.exports = fetchuser