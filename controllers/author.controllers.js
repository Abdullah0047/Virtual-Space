const Author = require('../models/Author')

class Controllers{

    constructor(){
        
    }

    async addAuthor(req,res){

      
        const {name, email, number, address, gender, dob} = req.body;
        
        let errors = []

        if(!name){ 
            errors.push('Name');
        }
        if(!email){
            errors.push('Email');
        }
        if(!number){
            errors.push('Number');
        }
        if(!address){
            errors.push('Address');
        }
        if(!gender){
            errors.push('Gender');
        } 
        if(!dob){
            errors.push('dob');
        }    
        if(errors.length > 0){
            errors = errors.join(',');
            return res.json({
                message: `These are required fields: ${errors}.`,
                status: false
            })
        }
        try { 
           
            let author = new Author({
                name,
                email,
                number,
                address,
                gender,
                dob
            });

            await author.save();
    
            res.status(200).json({'msg': 'Author Created'})

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error')
        }
    
    }

    async findAllAuthors(req,res){
        try {

            let authors = await Author.find();

            return res.send({authors})

        } catch (err) {
            console.error(err.message);
            res.status(500).send( 'Server Error')
        }
    }

    async findAuthor(req, res){
        try {
            let id = req.params.id
            let author = await Author.findById(id)
            if (!author) {
                return res.send("Author does not Found.");
            }

            return res.send({author})

        } catch (err) {
            console.error(err.message);
            res.status(500).send( 'Server Error')
        }
    }

    async deleteAuthor(req, res){
        const id = req.params.id
        try {
            let author = await Author.findById(id);
            if(!author){
                return res.send("Author does not Exist.");
            }

            await Author.findByIdAndRemove(id)
            res.status(200).json({'msg': 'Author Deleted Successfully'})
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error')
        }
        
    }

    async updateAuthor(req, res){
        const {name, email, number, address, gender,dob} = req.body;
        
        let errors = []

        if(!name){ 
            errors.push('Name');
        }
        if(!email){
            errors.push('Email');
        }
        if(!number){
            errors.push('Number');
        }
        if(!address){
            errors.push('Address');
        }  
        if(!gender){
            errors.push('Gender');
        } 
        if(!dob){
            errors.push('dob');
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
            let author = await Author.findById(id);
            if (!author) {
                return res.send("Author does not Exist.");
            }

            author.name = name;
            author.email = email;
            author.number = number;
            author.address = address;
            author.gender = gender;
            author.dob = dob;

            await publisher.save();

            res.status(200).send('Publisher Updated')
            
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error')
        }
    }

}

module.exports = new Controllers();