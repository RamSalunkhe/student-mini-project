const studentModel = require("../model/studentModel")
const validator = require("../validate/validator")
const ObjectId = require("mongoose").Types.ObjectId;


const createStudent = async (req, res) => {

    try{

        const requestBody = req.body;
        if(!validator.isvalidBody(requestBody))
            return res.status(400).send({status: false, message: "Invalid request Body !"})
        
        let {name, subject, marks} = requestBody
    
        if(!validator.isValid(name)) 
            return res.status(400).send({status: false, messge: 'Name is Mandatory field'});
    
        if(!validator.isValidName(name)) 
            return res.status(400).send({status: false, messge: `${name} is not a valid name`}); 
    
        if(!validator.isValid(subject)) 
            return res.status(400).send({status: false, messge: 'subject is Mandatory field'});
    
        if((["Maths", "English", "Javascript"].indexOf(subject) === -1)) 
            return res.status(400).send({status: false, message: "subject should be among Maths|English|Javascript"})
        
        if(!validator.ContainsNumber(marks)) {
            return res.status(400).send({status: false, message: "marks should be only Numbers"})
        }
            
        let userId = req.token.id;
        let finalData = {name, subject, marks, userId}

        let query = {name, subject, userId, isDeleted: false}
        const data = await studentModel.findOne(query)
        
        if(data) {

            if(data.userId == req.token.id ) {

                const updateData = await studentModel.findOneAndUpdate(query, {$inc:{marks: +marks}} ,{new: true});
                return res.status(200).send({status: true, message: "update Marks", data: updateData});
            }
        }


        const createData = await studentModel.create(finalData);
            return res.status(201).send({status: true, data: createData}) 

    }
    catch(error) {
        return res.status(500).send({status: false, message: error.message})
    }

}


////////////////////// get data ===========================>

const getStudent = async (req, res) => {
    try {
        let userId = req.params.userId;

        const getStudent = await studentModel.find({userId, isDeleted: false});
        return res.status(200).send({status: true, data: getStudent})

    }
    catch(error) {
        return res.status(500).send({status: false, message: error.message})
    }
}

/////////////////////////////// update student ======================================>

const updateStudent = async (req, res) => {
    try {

        let body = req.body;
        let sId = req.params.studentId;

        if(!validator.isvalidBody(body)) 
            return res.status(400).send({ status: false, message: `Invalid Input Parameters` });
        
            const requestBody = req.body;
            if(!validator.isvalidBody(requestBody))
                return res.status(400).send({status: false, message: "Invalid request Body !"})
            
            let {name, subject, marks} = requestBody
        
            if(!validator.isValid(name)) 
                return res.status(400).send({status: false, messge: 'Name is Mandatory field'});
        
            if(!validator.isValidName(name)) 
                return res.status(400).send({status: false, messge: `${name} is not a valid name`}); 
        
            if(!validator.isValid(subject)) 
                return res.status(400).send({status: false, messge: 'subject is Mandatory field'});
        
            if((["Maths", "English", "Javascript"].indexOf(subject) === -1)) 
                return res.status(400).send({status: false, message: "subject should be among Maths|English|Javascript"})
            
            if(!validator.ContainsNumber(marks)) {
                return res.status(400).send({status: false, message: "marks should be only Numbers"})
            }
    
            const data = await studentModel.findById({_id: sId, isDeleted: false })
    
           
        if( data.name == name && data.subject == subject) {
    
                const updateData = await studentModel.findOneAndUpdate({_id: sId, isDeleted: false}, {$inc:{marks: +marks}} ,{new: true});
                if(!updateData)  {
                    return res.status(200).send({status: true, message: "No data found with this credentials"});
                }

                    return res.status(200).send({status: true, message: "update Marks", data: updateData});
            
        } else {
            return res.status(404).send({status: false, message: "No data found with this credentials ....."});
        }

    } catch (error) {
        return res.status(500).send({status: false, message: error.message})
    }


}


/////////////////////////// delete stuent record =============================>

const deleteStudent = async (req, res) => {
    try {

        const sId = req.params.studentId;
    
    
        const student = await studentModel.findOneAndUpdate({_id: sId, isDeleted: false},{$set: {isDeleted: true}},{new: true})
        if(!student) return res.status(204).send({status: true, message :"Record Deleted already"});
    
        return res.status(200).send({status: true, message :"Record Deleted", data: student})

    } catch (error) {
        return res.status(500).send({status: false, message: error.message})
    }
   
}

    
module.exports = { createStudent, getStudent, updateStudent, deleteStudent }