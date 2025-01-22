const express = require('express');
const db = require('../database/db');
const { body, param } = require('express-validator');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');

const router = express.Router();

// Add an author
router.post(
    '/',
    auth,
    roles(['admin']),
    validate([
        body('name').isString().withMessage('Name is required'),
        body('bio').isString().withMessage('Bio is required'),
    ]),
    (req, res) => {
        const { name, bio } = req.body;
        const sql = 'INSERT INTO authors (name, bio) VALUES (?, ?)';
        db.query(sql, [name, bio], (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error adding author');
            }
            res.status(201).send('Author added successfully');
        });
    }
);

module.exports = router;
