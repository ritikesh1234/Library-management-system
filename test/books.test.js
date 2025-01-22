const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');  // Your app file
const should = chai.should();

chai.use(chaiHttp);

describe('Books', () => {
    it('should add a new book', (done) => {
        chai.request(app)
            .post('/api/books')
            .send({ title: 'The Hobbit', author_id: 1, genre: 'Fantasy' })
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('string').eql('Book added successfully');
                done();
            });
    });

    it('should fetch all books', (done) => {
        chai.request(app)
            .get('/api/books')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            });
    });
});
