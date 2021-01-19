const Publisher = require('../models/Publisher')

class Controllers{

    constructor(){
        
    }

    async addPublisher(req,res){

      
        const {name, email, number, address} = req.body;
        
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
        if(errors.length > 0){
            errors = errors.join(',');
            return res.json({
                message: `These are required fields: ${errors}.`,
                status: false
            })
        }
        try { 
           
            let publisher = new Publisher({
                name,
                email,
                number,
                address
            });

            await publisher.save();
    
            res.status(200).json({'msg': 'Publisher Created'})

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error')
        }
    
    }

    async findAllPublishers(req,res){
        try {

            let publishers = await Publisher.find();

            return res.send({publishers})

        } catch (err) {
            console.error(err.message);
            res.status(500).send( 'Server Error')
        }
    }

    async findPublisher(req, res){
        try {
            let id = req.params.id
            let publisher = await Publisher.findById(id)
            if (!publisher) {
                return res.send("Publisher does not Found.");
            }

            return res.send({publisher})

        } catch (err) {
            console.error(err.message);
            res.status(500).send( 'Server Error')
        }
    }

    async deletePublisher(req, res){
        const id = req.params.id
        console.log(id)
        try {
            let publisher = await Publisher.findById(id);
            if(!publisher){
                return res.send("Publisher does not Exist.");
            }

            await Publisher.findByIdAndRemove(id)
            res.status(200).json({'msg': 'Publisher Deleted Successfully'})
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error')
        }
        
    }

    async updatePublisher(req, res){
        const {name, email, number, address} = req.body;
        
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
        if(errors.length > 0){
            errors = errors.join(',');
            return res.json({
                message: `These are required fields: ${errors}.`,
                status: false
            })
        }
        try {
            let id = req.params.id
            let publisher = await Publisher.findById(id);
            if (!publisher) {
                return res.send("Publisher does not Exist.");
            }

            publisher.name = name;
            publisher.email = email;
            publisher.number = number;
            publisher.address = address;

            await publisher.save();

            res.status(200).send('Publisher Updated')
            
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error')
        }
    }

}

module.exports = new Controllers();