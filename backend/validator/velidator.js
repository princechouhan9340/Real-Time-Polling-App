const emailValidator = require("email-validator")

// VALIDATION FUNCTION FOR EMAIL-----
const isEmailValid = function(value){
    const email = emailValidator.validate(value)
    if(!email) return false
    return true
}

// TAKE DATA FROM REQ.BODY-----
let passwordregex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/
const isValidPass = function(value){
    const pass = value.match(passwordregex);
    if(!pass) return false;
    return true
}


module.exports = {
    isEmailValid,
    isValidPass
}