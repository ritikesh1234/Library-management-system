const roles = (allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.headers['x-user-role'];
        if (!allowedRoles.includes(userRole)) {
            return res.status(403).send('Forbidden: Insufficient Permissions');
        }
        next();
    };
};

module.exports = roles;
