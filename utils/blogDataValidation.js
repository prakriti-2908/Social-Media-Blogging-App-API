
const blogDataValidation = ({title,textBody})=>{
    return new Promise((resolve,reject)=>{
        if(!title || !textBody){
            reject("Missing blog data");
        }
        if(typeof title !== "string"){reject("Title is not a string")};
        if(typeof textBody !== "string"){reject("Text Body is not a string")};
        if(title.length <3){reject("Title should have minimum length of 3 letters")};
        if(title.length>100){reject("Length of title should not exceed 100 letters")};
        if(textBody.length <10){reject("Text Body should have minimum length of 10 letters")};
        if(textBody.length>3000){reject("Length of Text Body should not exceed 3000 letters")};
        resolve();
    })
};

module.exports = blogDataValidation;