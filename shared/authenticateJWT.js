const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
//const jwt = require('jsonwebtoken');



// Middleware to verify JWT token
exports. authenticateJWT=(req, res, next)=> {
    const bearerHeader = req.headers["authorization"];

    if (!bearerHeader) {
        return res.status(401).json({ message: 'Authentication failed: No token provided' });
    }

    const bearer = bearerHeader.split(" ");
    
    if (bearer.length !== 2 || bearer[0].toLowerCase() !== 'bearer') {
        return res.status(401).json({ message: 'Authentication failed: Invalid authorization header format' });
    }

    const token = bearer[1];

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Authentication failed: Invalid token' });
        }

        req.user = user; // Attach the user to the request object
        next(); // Continue to the protected route
    });
}






