const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com', // Your email
        pass: 'your-email-password'    // Your email password
    }
});

const sendOverdueNotification = (memberEmail, bookTitle, returnDate) => {
    const mailOptions = {
        from: 'your-email@gmail.com',
        to: memberEmail,
        subject: 'Overdue Book Reminder',
        text: `Your book "${bookTitle}" was due back on ${returnDate}. Please return it as soon as possible.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};

module.exports = { sendOverdueNotification };
