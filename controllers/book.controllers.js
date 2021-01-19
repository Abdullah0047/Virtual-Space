const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
    cloud_name: 'dny3sfgon', 
    api_key: '759841628768467', 
    api_secret: '_qeF3d9oOSrObFBI6o9GiGeKvc8' 
});

const Book = require('../models/Book')

class Controllers{

    constructor(){
        
    }

    async addBook(req,res){

      
        const {name, iban, publisher, author} = req.body;
        
        let errors = []

        if(!name){ 
            errors.push('Name');
        }
        if(!iban){
            errors.push('IBAN');
        }
        if(!publisher){
            errors.push('Publisher');
        }
        if(!author){
            errors.push('Author');
        }  
        if(errors.length > 0){
            errors = errors.join(',');
            return res.json({
                message: `These are required fields: ${errors}.`,
                status: false
            })
        }
        try { 

            let pdf = req.files[0].path;
            let cover = req.files[1].path;
            console.log(pdf);
            console.log(cover);
           
            

            let book = new Book({
                name,
                iban, 
                publisher,
                author,
                pdf,
                cover
            });

            await book.save();
    
            res.status(200).json({'msg': 'Book Added'})

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error')
        }
    
    }

    async findAllBooks(req,res){
        try {

            let books = await Book.find().populate('publisher author');

            return res.send({books})

        } catch (err) {
            console.error(err.message);
            res.status(500).send( 'Server Error')
        }
    }

    async findBook(req, res){
        try {
            let id = req.params.id
            let book = await Book.findById(id).populate('publisher author');
            if (!book) {
                return res.send("Book does not Found.");
            }

            return res.send({book})

        } catch (err) {
            console.error(err.message);
            res.status(500).send( 'Server Error')
        }
    }

    async deleteBook(req, res){
        const id = req.params.id
        try {
            let book = await Book.findById(id);
            if(!book){
                return res.send("book does not Exist.");
            }

            await Book.findByIdAndRemove(id)
            res.status(200).json({'msg': 'Book Deleted Successfully'})
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error')
        }
        
    }

    async updateBook(req, res){
        const {name, iban} = req.body;
        
        let errors = []

        if(!name){ 
            errors.push('Name');
        }
        if(!iban){
            errors.push('IBAN');
        }
        if(errors.length > 0){
            errors = errors.join(',');
            return res.json({
                message: `These are required fields: ${errors}.`,
                status: false
            })
        }
        try {
            let id = req.params.id
            let book = await Book.findById(id);
            if (!book) {
                return res.send("Book does not Exist.");
            }

            book.name = name;
            book.iban =iban;

            await publisher.save();

            res.status(200).send('Publisher Updated')
            
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error')
        }
    }

}

module.exports = new Controllers();