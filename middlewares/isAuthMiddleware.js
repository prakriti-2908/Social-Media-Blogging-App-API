
const isAuthMiddleware = (req,res,next) => {
    if(!req.session.isAuth){
        return res.send({
            status: 401,
            message:"You are not allowed to access this api, please login first",
        })
    }
    next();
}

module.exports = isAuthMiddleware;