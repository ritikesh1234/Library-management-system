# Library-management-system
Project Description
This is a Library Management System that allows users to manage books, authors, and members in a library. The system supports functionalities such as:

Registering members.
Adding, updating, and removing books.
Borrowing and returning books.
Searching for books based on title, author, or genre.
Viewing borrow history and overdue books.
It is a full-stack application built using Node.js, Express, and MySQL for the backend, providing RESTful APIs for managing the library system.

Setup Instructions
Prerequisites
Node.js: You need to have Node.js installed on your system.
MySQL: You need to have MySQL installed and running.
Postman (optional for testing APIs): You can use Postman to test the API endpoints.
Steps to Set Up Locally
Clone the Repository:

Clone this repository to your local machine:
git clone https://github.com/ritikesh1234/Library-management-system.git
cd Library-management-system

Install Dependencies:

Install the necessary dependencies:
npm install


Setup Database:

Make sure you have MySQL installed and create a database named library by running the SQL commands provided in the project.

CREATE DATABASE library;
USE library;

CREATE TABLE authors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    bio TEXT
);

CREATE TABLE books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author_id INT NOT NULL,
    genre VARCHAR(50),
    availability BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (author_id) REFERENCES authors(id)
);

CREATE TABLE members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact_info VARCHAR(255)
);

CREATE TABLE borrow_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    book_id INT NOT NULL,
    member_id INT NOT NULL,
    borrow_date DATE NOT NULL,
    return_date DATE,
    return_status VARCHAR(255) DEFAULT 'borrowed',
    FOREIGN KEY (book_id) REFERENCES books(id),
    FOREIGN KEY (member_id) REFERENCES members(id)
);

Configure Environment:

Create a .env file in the root directory to configure your database connection:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=library

Start the Application:

Run the application:
npm start

Sample API Usage
1. Register a New Member
Endpoint: POST /api/members
Request Body:{
    "name": "John Doe",
    "contact_info": "john.doe@example.com"
}
Response:{
    "id": 1,
    "name": "John Doe",
    "contact_info": "john.doe@example.com"
}
. Add a New Book
Endpoint: POST /api/books
Request Body:{
    "title": "Harry Potter and the Philosopher's Stone",
    "author_id": 1,
    "genre": "Fantasy"
}
Response: {
    "id": 1,
    "title": "Harry Potter and the Philosopher's Stone",
    "author_id": 1,
    "genre": "Fantasy",
    "availability": true
}
Borrow a Book
Endpoint: POST /api/borrow
Request Body:{
    "member_id": 1,
    "book_id": 1,
    "return_deadline": "2025-02-01"
}
Response: {
    "message": "Book borrowed successfully."
}
Search Books by Title
Endpoint: GET /api/books/search?title=Harry
Response:[
    {
        "id": 1,
        "title": "Harry Potter and the Philosopher's Stone",
        "author_id": 1,
        "genre": "Fantasy",
        "availability": true
    }
]
Get Borrow History
Endpoint: GET /api/borrow/:member_id
Response:[
    {
        "id": 1,
        "book_id": 1,
        "member_id": 1,
        "borrow_date": "2025-01-22",
        "return_date": null,
        "return_status": "borrowed"
    }
]
