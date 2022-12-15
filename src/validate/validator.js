const bcrypt = require("bcrypt")



const isvalidBody = (body) => {
    return (Object.keys(body).length > 0) 
}

const isValid = (value) => {
    if(typeof value === 'undefined' || typeof value === null) return false;
    if(typeof value === 'string' && value.trim().length == 0) return false;

    return true;
}

const isValidName = function (name) { 
    return /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/g.test(name);
}

const isValidEmail = (email) => {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
}

const hashedPassword = async (password) => {
    let p1 = await bcrypt.hash(password, 10)
    return p1
}

function ContainsNumber(num) {
    return /\d/.test(num);
}

module.exports = {isvalidBody, isValid, isValidName, isValidEmail, hashedPassword, ContainsNumber}