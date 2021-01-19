const authToken = require('./utils/authToken');
const isAdmin = require('./utils/isAdmin');
const user = require('./controllers/user.controllers')
const publisher = require('./controllers/publisher.controllers')
const author = require('./controllers/author.controllers')
const book = require('./controllers/book.controllers')
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });


module.exports = function (app){

    app.post('/register', user.signUp);
    app.post('/user/login', user.userLogIn)
    app.post('/admin/login', user.adminLogIn)
    app.post('/admin/createUser',user.createUser)
    app.post('/user/changePassword',authToken,  user.changePassword)
    app.get('/', user.main)
    app.post('/forgotPassword', user.forgotPassword);
    app.post('/resetPassword/:token', user.resetPassword);
    app.get('/findAllUsers/:role?',  user.findAllUsers);
    app.get('/findUser/:id',  user.findUser);
    app.delete('/deleteUser/:id',  user.deleteUser)
    app.put('/updateUser/:id',  user.updateUser)

    app.post('/addPublisher', publisher.addPublisher)
    app.get('/publishers', publisher.findAllPublishers)
    app.get('/publisher/:id', publisher.findPublisher)
    app.delete('/deletePublisher/:id', publisher.deletePublisher)
    app.put('/updatePublisher/:id', publisher.updatePublisher)

    app.post('/addAuthor', author.addAuthor)
    app.get('/authors', author.findAllAuthors)
    app.get('/author/:id', author.findAuthor)
    app.delete('/deleteAuthor/:id', author.deleteAuthor)
    app.put('/updateAuthor/:id', author.updateAuthor)

    app.post('/addBook',upload.array('books', 5), book.addBook)
    app.get('/books', book.findAllBooks)
    app.get('/book/:id', book.findBook)
    app.delete('/deleteBook/:id', book.deleteBook)
    app.put('/updateBook/:id', book.updateBook)

}