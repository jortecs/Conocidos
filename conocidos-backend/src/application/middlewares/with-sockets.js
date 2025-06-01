const withSockets = io => (req, res, next) => {
    req.io = io;
    return next();
};

export default withSockets;
