const isAuthMiddleware = (req, res, next) => {
    // console.log("Session data in middleware:", req.session);
    if (!req.session.isAuth) {
        return res.status(401).send({
            message: "You are not allowed to access this API, please login first",
        });
    }
    next();
};

module.exports = isAuthMiddleware;
