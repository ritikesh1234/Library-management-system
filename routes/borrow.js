// routes/borrow.js
const express = require('express');
const router = express.Router();
const db = require('../database/db');  // Ensure the database connection is correct

// Borrow a book
router.post('/', (req, res) => {
    const { member_id, book_id, return_deadline } = req.body;
    const borrow_date = new Date();

    // Check if all required fields are provided
    if (!member_id || !book_id || !return_deadline) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    // Insert into borrow_history table
    const sql = `
        INSERT INTO borrow_history (member_id, book_id, borrow_date, return_deadline, return_date, return_status)
        VALUES (?, ?, ?, ?, NULL, 'borrowed')
    `;
    db.query(sql, [member_id, book_id, borrow_date, return_deadline], (err, result) => {
        if (err) {
            console.error('Error inserting into borrow_history:', err);
            return res.status(500).json({ message: 'Error borrowing book', error: err.message });
        }

        // Update book availability
        const updateSql = 'UPDATE books SET availability = 0 WHERE id = ?';
        db.query(updateSql, [book_id], (err) => {
            if (err) {
                console.error('Error updating book availability:', err);
                return res.status(500).json({ message: 'Error updating book availability', error: err.message });
            }

            res.status(201).json({ message: 'Book borrowed successfully' });
        });
    });
});

// Get Borrow History of a Member
router.get('/:member_id', (req, res) => {
    const { member_id } = req.params;

    const query = `
        SELECT bh.id, b.title, bh.borrow_date, bh.return_date, bh.return_status
        FROM borrow_history bh
        JOIN books b ON bh.book_id = b.id
        WHERE bh.member_id = ?
    `;

    db.query(query, [member_id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error fetching borrow history', error: err });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'No borrow history found for this member' });
        }

        return res.status(200).json({ borrow_history: result });
    });
});

// Get Overdue Borrow History of a Member
router.get('/overdue/:member_id', (req, res) => {
    const { member_id } = req.params;

    const query = `
        SELECT bh.id, b.title, bh.borrow_date, bh.return_date, bh.return_status
        FROM borrow_history bh
        JOIN books b ON bh.book_id = b.id
        WHERE bh.member_id = ? AND bh.return_status = 'borrowed' AND bh.return_date < CURDATE()
    `;

    db.query(query, [member_id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error fetching overdue borrow history', error: err });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'No overdue books found for this member' });
        }

        return res.status(200).json({ overdue_books: result });
    });
});

// Return a Book
router.post('/return', (req, res) => {
    const { member_id, book_id } = req.body;

    // Ensure the book is borrowed by the member
    const query = `
        UPDATE borrow_history
        SET return_date = NOW(), return_status = 'returned'
        WHERE member_id = ? AND book_id = ? AND return_status = 'borrowed';
    `;

    db.query(query, [member_id, book_id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error returning book', error: err });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'No such borrowed book found' });
        }

        return res.status(200).json({ message: 'Book returned successfully' });
    });
});


module.exports = router;
