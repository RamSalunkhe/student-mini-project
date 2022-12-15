const express = require('express');
const router = express.Router();
const userController = require("../controller/userController");
const studentController = require("../controller/studentController")
const Auth = require("../middleware/auth")






router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);

router.post("/student", Auth.Authentication, studentController.createStudent);
router.get("/student/:userId", Auth.Authentication,Auth.Authorisation, studentController.getStudent);
router.put("/student/:studentId", Auth.Authentication, Auth.Authorization, studentController.updateStudent);
router.delete("/student/:studentId", Auth.Authentication, Auth.Authorization, studentController.deleteStudent);

router.all("/*", function (req, res) {
    res.status(400).send({status: false, message: "Make Sure Your Endpoint is Correct !!!"
    })
})

module.exports = router;