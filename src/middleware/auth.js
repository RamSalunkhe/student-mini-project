//=====================Importing Module and Packages=====================//
const JWT = require("jsonwebtoken")
const studentModel = require("../model/studentModel")
const mongoose = require('mongoose')



//=====================This function used for Authentication(Phase II)=====================//
const Authentication = async function (req, res, next) {
    try {

        //=====================Check Presence of Key with Value in Header=====================//
        let token = req.headers['x-api-key']
        if (!token) { return res.status(400).send({ status: false, msg: "Token must be Present." }) }

        //=====================Verify token & asigning it's value in request body =====================//
        JWT.verify (token, "student-mini-project", ( error, decodeToken ) => {
            if(error) {
                return res.status(401).send({status: false, message: "Token is invalid"})
            } else {
                req.token = decodeToken
                next()
            }
        })

    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}



//=====================This function used for Authorisation(Phase II)=====================//
const Authorisation = async function (req, res, next) {
    try {

        //<<<<================================ Authorisation By Path Params =====================================>>>>//
        let userId = req.params.userId;

        if (!userId)
            return res.status(400).send({ status: false, message: "Please, enter userId" });

        if (!mongoose.Types.ObjectId.isValid(userId))
            return res.status(400).send({ status: false, message: "Invalid userId" });
        

        //=================== Fetching Blogid from DB =====================//
        const user = await studentModel.findOne({ userId: userId, isDeleted: false})
        if (!user) {
            return res.status(404).send({ status: false, message: `user is not found` })
        }


        //==================== Comparing Authorid of DB and Decoded Documents =====================//
        if (userId !== req.token.id) {
            return res.status(400).send({ status: false, message: `Unauthorized access!` });
        }

        next()

    } catch (error) {

        res.status(500).send({ status: false, msg: error.message })
    }

}

//================================ Student Authorization===========================================//

const Authorization = async (req, res, next) => {
    try {

        let sId = req.params.studentId;
        
        if(!sId) return res.status(400).send({status: false, message:"Student Id is required to update data"});
    
        if (!mongoose.Types.ObjectId.isValid(sId))
            return res.status(400).send({status: false, message: `${sId} is NOT a valid Student id`});
    
        const isStudentExist = await studentModel.findById(sId)
    
        if(!isStudentExist) return res.status(404).send({status: false, message: `Student NOT found check student id`});
        
        if(req.token.id !== isStudentExist.userId.toString()) 
            return res.status(403).send({ status: false, message: `Unauthorized Request !` });
    
        next()

    } catch (error) {

        res.status(500).send({ status: false, msg: error.message })
    }
}

module.exports = {Authentication, Authorisation, Authorization}
