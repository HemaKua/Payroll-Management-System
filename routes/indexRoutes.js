const express = require('express');
const router = express.Router();

// Import sub routes
const authRoutes = require('./authRoutes');
const apiRoutes = require('./apiRoutes');

// Define root routes
router.get('/', (req, res) => {
    res.send('Welcome to the root route!');
});

// Use sub routes
router.use('/auth', authRoutes);
router.use('/api', apiRoutes);



module.exports = router;
