const auth = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token || token !== 'Bearer valid-token') {
        return res.status(401).send('Unauthorized');
    }
    next();
};

module.exports = auth;
