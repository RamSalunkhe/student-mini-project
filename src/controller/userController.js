const userModel = require('../model/userModel');
const validator = require('../validate/validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


///////////////// Register User ==============================>

const registerUser = async (req, res) => {
    try {
        let requestBody = req.body;

        if(Object.keys(requestBody).length === 0) 
            return res.status(400).send({status: false, message : "Invalid request body !"})
        
        let {name, email, password} = requestBody;

        if(!validator.isValid(name)) 
            return res.status(400).send({status: false, messge: 'Name is Mandatory field'});

        if(!validator.isValidName(name)) 
            return res.status(400).send({status: false, messge: `${name} is not a valid name`}); 

        if(!validator.isValid(email)) 
            return res.status(400).send({status: false, messge: 'email is Mandatory field'});

        if(!validator.isValidEmail(email))
            return res.status(400).send({status: false, messge: 'email is not valid'});

        let isEmailExist = await userModel.findOne({ email })
        if (isEmailExist)
            return res.status(400).send({ status: false, message: `This email ${email} is Already In Use`});
        
        if(!validator.isValid(password)) 
            return res.status(400).send({status: false, messge: 'Password is Mandatory field'});
        
        password = password.trim()
        let hashedPassword = await validator.hashedPassword(password);

        let finalData = {name, email, password: hashedPassword}

        const newUser = await userModel.create(finalData)
            return res.status(201).send({ status: true, message: 'User created Successfully', Data: newUser })

    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
      }
}

/////////////////////// Login user ======================>

const loginUser = async (req, res) => {
    try{
      const {email, password}  = req.body
  
      if(!email) return res.status(400).send({status:false, message: "Email is required"})

      if(!validator.isValid(email)) 
      return res.status(400).send({status: false, messge: 'email is Mandatory field'});

      if(!validator.isValidEmail(email))
      return res.status(400).send({status: false, messge: 'email is not valid'});

      if(!password) return res.status(400).send({status:false, message: "Password is required"})

      if(!validator.isValid(password)) 
        return res.status(400).send({status: false, messge: 'Password is Mandatory field'});
    
      const user = await userModel.findOne({email})
    
      if(user) {

        const checkPassword = await bcrypt.compare(password, user.password)
        if(!checkPassword) return res.status(400).send({status:false, message: "Password is Wrong"})
    
      }else {
    
        return res.status(404).send({status:false, message: "user is not exists"})
      }
  
      //=====================================Jwt (jsonwebtoken)============================================
    
      const token = jwt.sign({
        id: user._id.toString(),
        iat: Math.floor(new Date().getTime() / 1000)
      }, "student-mini-project", {expiresIn: "23h"});

      res.setHeader("x-api-key", token);
  
      return res.status(200).send({status: true, message: "User login Successfully", userId: user._id})
  
    }
      catch(error) {
        return res.status(500).send({status: false, message: error.message})
    }
  }
  
  
  

module.exports  = {registerUser, loginUser};