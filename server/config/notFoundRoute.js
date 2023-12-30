const notFoundRoute = (req, res, next) => {
    res.status(404);
    next(new Error("this url path does not exist"));
}

module.exports = notFoundRoute;