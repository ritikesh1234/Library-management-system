const express = require('express');
const db = require('../database/db');
const { body, param } = require('express-validator');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');

const router = express.Router();

// POST route to add a new book
router.post(
    '/',
    validate([  // Validation middleware to check the data
        body('title').notEmpty().withMessage('Title is required'),
        body('author_id').isInt().withMessage('Author ID must be an integer'),
        body('genre').notEmpty().withMessage('Genre is required'),
    ]),
    (req, res) => {
        const { title, author_id, genre } = req.body;

        const sql = 'INSERT INTO books (title, author_id, genre) VALUES (?, ?, ?)';
        db.query(sql, [title, author_id, genre], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Error adding book' });
            }

            res.status(201).json({
                message: 'Book added successfully',
                book: {
                    id: result.insertId,
                    title,
                    author_id,
                    genre
                }
            });
        });
    }
);

// PUT route to update a book by ID
router.put(
    '/:id',
    validate([  // Validation middleware to check the data
        body('title').notEmpty().withMessage('Title is required'),
        body('author_id').isInt().withMessage('Author ID must be an integer'),
        body('genre').notEmpty().withMessage('Genre is required'),
        body('availability').isBoolean().withMessage('Availability must be a boolean'),
    ]),
    (req, res) => {
        const { id } = req.params;  // Extract book ID from the URL parameters
        const { title, author_id, genre, availability } = req.body;

        const sql = `
            UPDATE books 
            SET title = ?, author_id = ?, genre = ?, availability = ? 
            WHERE id = ?
        `;
        db.query(sql, [title, author_id, genre, availability, id], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Error updating book' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Book not found' });
            }

            res.status(200).json({
                message: 'Book updated successfully',
                book: {
                    id,
                    title,
                    author_id,
                    genre,
                    availability
                }
            });
        });
    }
);

// DELETE route to delete a book by ID
router.delete('/:id', (req, res) => {
    const { id } = req.params;  // Extract the book ID from the URL parameters

    const sql = 'DELETE FROM books WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error deleting book' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Book not found' });
        }

        res.status(200).json({ message: 'Book deleted successfully' });
    });
});

// Search Books by Title, Author, or Genre
router.get('/search', (req, res) => {
    const { title, author, genre } = req.query;

    // Constructing the SQL query based on available query parameters
    let query = 'SELECT * FROM books b';
    let conditions = [];
    let params = [];

    if (title) {
        conditions.push('b.title LIKE ?');
        params.push(`%${title}%`);
    }
    if (author) {
        conditions.push('a.name LIKE ?');
        params.push(`%${author}%`);
    }
    if (genre) {
        conditions.push('b.genre LIKE ?');
        params.push(`%${genre}%`);
    }

    if (conditions.length > 0) {
        query += ' JOIN authors a ON b.author_id = a.id WHERE ' + conditions.join(' AND ');
    }

    // Execute the query
    db.query(query, params, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error searching books', error: err });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'No books found' });
        }

        return res.status(200).json({ books: result });
    });
});

// Get all books
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM books';
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error fetching books');
        }
        res.json(results);
    });
});

module.exports = router;
