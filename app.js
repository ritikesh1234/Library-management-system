const express = require('express');
const db = require('./database/db');
const errorHandler = require('./middleware/errorHandler');

const booksRoutes = require('./routes/books');
const authorsRoutes = require('./routes/authors');
const membersRoutes = require('./routes/members');
const borrowRoutes = require('./routes/borrow');

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/books', booksRoutes);
app.use('/authors', authorsRoutes);
app.use('/members', membersRoutes);
app.use('/api/borrow', borrowRoutes);
app.use('/api/members', membersRoutes); // Route handler

// Error handling middleware
app.use(errorHandler);

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
