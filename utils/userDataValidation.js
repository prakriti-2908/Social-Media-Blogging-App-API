function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{8,}$/;
    return passwordRegex.test(password);
}

const userDataValidation = ({name,email,password,username})=>{
    return new Promise((resolve,reject)=>{
        if(!email || !password || !username){
            return reject("Please fill all the required fields");
        }
        if(typeof password!=="string"){
            return reject("Password is not a string");
        }
        if(typeof name!=="string"){
            return reject("Name is not a String");

        }
        if(typeof email!=="string"){
            return reject("Email is not a string");
        }
        if(typeof username!=="string"){
            return reject("USername is not a String");
        }

        if(!validateEmail(email)){
            return reject("Please enter a valid email");
        }

        // off password validation for development period
        
        // if(!validatePassword(password)){
        //     return reject("Please use a special character, capital letter and a number for password");
        // }

        return resolve("All good to go");
    })
}

module.exports = userDataValidation;