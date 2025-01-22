const express = require('express');
const db = require('../database/db');
const { body } = require('express-validator');
const validate = require('../middleware/validate');

const router = express.Router();

// Register a member
router.post(
    '/',
    validate([
        body('name').isString().withMessage('Name is required'),
        body('contact_info').isString().withMessage('Contact info is required'),
    ]),
    (req, res) => {
        const { name, contact_info } = req.body;
        const sql = 'INSERT INTO members (name, contact_info) VALUES (?, ?)';
        db.query(sql, [name, contact_info], (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error registering member');
            }
            res.status(201).send('Member registered successfully');
        });
    }
);

// POST route to create a new member
router.post('/', (req, res) => {
    const { name, contact_info } = req.body;
    
    // Example: Insert member into the database (you need to implement the DB logic)
    const sql = 'INSERT INTO members (name, contact_info) VALUES (?, ?)';
    db.query(sql, [name, contact_info], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Failed to create member' });
        }
        res.status(201).json({ message: 'Member created successfully', memberId: result.insertId });
    });
});

// GET route to fetch all members
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM members';
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error fetching members' });
        }
        res.status(200).json(results);
    });
});

// GET route to fetch a member by ID
router.get('/:id', (req, res) => {
    const memberId = req.params.id;

    const sql = 'SELECT * FROM members WHERE id = ?';
    db.query(sql, [memberId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error fetching member' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Member not found' });
        }
        res.status(200).json(results[0]);
    });
});

module.exports = router;
