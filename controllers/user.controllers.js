const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const nodemailer = require('nodemailer');
const senderEmail = config.get('EMAIL');
const password = config.get('PASSWORD');


const User = require('../models/User')

class Controllers{

    constructor(){
        console.log('')
    }
    async main(req, res){
        res.send('Welcome')
    }

    async signUp (req, res){
         
        const {name , email, password, userRole} = req.body;

        let errors = []

        if(!name){
            errors.push('First name');
        }
        if(!email){
            errors.push('Email');
        }   
        if(!password){
            errors.push('Password');
        }
        if(errors.length > 0){
            errors = errors.join(',');
            return res.json({
                message: `These are required fields: ${errors}.`,
                status: false
            })
        }
        
        try {
            let user = await User.findOne({email})
            
            if (user) {
                return res.status(400).json({'msg': 'User already exists'})
            } else {
                user = new User({
                    name,
                    email,
                    password,
                    userRole
                })
    
                let salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(password, salt);
    
                await user.save();
    
                const payload = {
                    user:{
                        id: user.id,
                        userRole : user.userRole
                    }
                }
    
                jwt.sign(payload, config.get('jwtSecret'), {
                    expiresIn: 360000
                }, (err, token) => {
                    if (err) throw err;
                    res.json({token})
                });
            }
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error')
        }
    }

    async userLogIn(req, res) {
        const {email, password} = req.body;
        
        let errors = []

        if(!email){
            errors.push('Email');
        }   
        if(!password){
            errors.push('Password');
        }
        if(errors.length > 0){
            errors = errors.join(',');
            return res.json({
                message: `These are required fields: ${errors}.`,
                status: false
            })
        }
        try {
            let user = await User.findOne({email})
    
            if(!user){
               return res.status(400).json({msg: 'Invalid Credentials'})
            }
            if(user.userRole === 'admin'){
                return res.status(400).json({msg: 'Access Denied'})
            }
    
            const isMatch = await bcrypt.compare(password, user.password)
    
            if(!isMatch){
                return res.status(400).json({msg: 'Invalid Credentials'})
            }
    
            const payload = {
                user:{
                    id: user.id,
                    userRole: user.userRole
                }
            }
    
            jwt.sign(payload, config.get('jwtSecret'), {
                expiresIn: 360000
            }, (err, token) => {
                if (err) throw err;
                res.send({token, user})
            });
    
        } catch (err) {
            console.error(err.message);
            res.status(500).send( 'Server Error')
        }
        
    }

    async adminLogIn(req, res) {
        const {email, password} = req.body;
        
        let errors = []

        if(!email){
            errors.push('Email');
        }   
        if(!password){
            errors.push('Password');
        }
        if(errors.length > 0){
            errors = errors.join(',');
            return res.json({
                message: `These are required fields: ${errors}.`,
                status: false
            })
        }
        try {
            let user = await User.findOne({email})
    
            if(!user){
               return res.status(400).json({msg: 'Invalid Credentials'})
            }
            if(user.userRole === 'seller'){
                return res.status(400).json({msg: 'Access Denied'})
            }
    
            const isMatch = await bcrypt.compare(password, user.password)
    
            if(!isMatch){
                return res.status(400).json({msg: 'Invalid Credentials'})
            }
    
            const payload = {
                user:{
                    id: user.id,
                    userRole: user.userRole
                }
            }
    
            jwt.sign(payload, config.get('jwtSecret'), {
                expiresIn: 360000
            }, (err, token) => {
                if (err) throw err;
                res.json({token, user})
            });
    
        } catch (err) {
            console.error(err.message);
            res.status(500).send( 'Server Error')
        }
        
    }

    async createUser(req,res){
        
        var {name , email, password, userRole } = req.body;


        let errors = []

        if(!name){
            errors.push('First name');
        }
        if(!email){
            errors.push('Email');
        }   
        if(!password){
            errors.push('Password');
        }
        if(!userRole){
            userRole = 'user'
        }
        if(errors.length > 0){
            errors = errors.join(',');
            return res.json({
                message: `These are required fields: ${errors}.`,
                status: false
            })
        }
        
        try {
            let user = await User.findOne({email})
            
            if (user) {
                return res.status(400).json({'msg': 'User already exists'})
            } else {
                user = new User({
                    name,
                    email,
                    password,
                    userRole
                })
    
                let salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(password, salt);
    
                await user.save();
    
                const payload = {
                    user:{
                        id: user.id
                    }
                }
    
                jwt.sign(payload, config.get('jwtSecret'), {
                    expiresIn: 360000
                }, (err, token) => {
                    if (err) throw err;
                    res.json({token})
                });
            }
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error')
        }
    }


    async changePassword(req, res){
        const {oldPassword, newPassword, confirmPassword} = req.body; 

        let errors = []

        if(!oldPassword){
            errors.push('Old Password');
        }
        if(!newPassword){
            errors.push('New Password');
        }
        if(!confirmPassword){
            errors.push('Confirm Password');
        }
        if(errors.length > 0){
            errors = errors.join(',');
            return res.json({
                message: `These are required fields: ${errors}.`,
                status: false
            })
        }
        try {

            const id = req.user.id

            let user = await User.findById(id)

            const isMatch = await bcrypt.compare(oldPassword, user.password)
    
            if(!isMatch){
                return res.status(400).json({msg: 'Invalid Old Password'})
            }

            console.log(newPassword, confirmPassword)

            if(newPassword === confirmPassword){

                let salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(newPassword, salt);

                user.save()

                res.status(200).json({'msg': 'Password Updated Successfully'})
            }

            res.status(200).json({'msg': 'New Password is not equals to Confirm Password'})
            
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error')
        }

    }


    async forgotPassword(req, res){

        let resetToken = Math.random().toString(36).substring(4);
        console.log("random", resetToken);

        try {
            
            let {email} = req.body;

            let errors = []

            if(!email){
                errors.push('Email');
            }   
            if(errors.length > 0){
                errors = errors.join(',');
                return res.json({
                    message: `These are required fields: ${errors}.`,
                    status: false
                })
            }

            let user = await User.findOne({email})

            if(!user){
                return res.send("No account with the given email address exists.");
            }

            user.resetPasswordToken = resetToken;
            user.resetPasswordExpires = Date.now() + 300000;

            user.save();

            let mailText =
                "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
                "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
                "http://" +
                req.headers.host +
                "/resetPassword/" +
                resetToken +
                "\n\n" +
                "If you did not request this, please ignore this email and your password will remain unchanged.\n";
            let to = req.body.email;
            let subject = "Reset your Password";

            let transporter = await nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: senderEmail,
                    pass: password
                }
            });
            
            let mailOptions = await {
                from: 'Spadasoft',
                to: 'mianmaaz404@gmail.com',
                subject: subject,
                text: mailText 
            
            };
            
            await transporter.sendMail(mailOptions, function(err){
                if(err){
                    console.log(err)
                }else{
                    console.log("Mail Sent");
                }
            });
            
            return res.send("Email send to the given mail");

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error')
        }

    }

    async resetPassword(req, res){
        try {
            
            let user = await User.findOne({
              resetPasswordToken: req.params.token,
              resetPasswordExpires: { $gt: Date.now() },
            });
            
            if (!user) {
              return res.send({
                message: "Password reset token is invalid or has expired.",
              });
            }
            
            let newPassword = req.body.newPassword;
            let confirmPassword = req.body.confirmPassword;

            let errors = []

            if(!newPassword){
                errors.push('New Password');
            }
            if(!confirmPassword){
                errors.push('Confirm Password');
            }
            if(errors.length > 0){
                errors = errors.join(',');
                return res.json({
                    message: `These are required fields: ${errors}.`,
                    status: false
                })
            }
            
            if (newPassword === confirmPassword) {
               
                let salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(newPassword, salt);
               
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;
                
                await user.save();
                return res.send({ message: "Success! Password is changed" });
            } else {
              
                return res.send({ message: "Password do not match" });
            }
        }catch (error) {
            return res.send({ message: "Something went wrong!!!" });
        }

    }

    async findAllUsers(req,res){
        try {
            let userRole = 'user';
            if(req.params.role){
                userRole = req.params.role
                console.log(userRole)
            } 
            let users = await User.find({userRole: userRole});

            return res.send({users : users})

        } catch (err) {
            console.error(err.message);
            res.status(500).send( 'Server Error')
        }
    }

    async findUser(req, res){
        try {
            let id = req.params.id
            
            let user = await User.findById(id);
            if (!user) {
                return res.send("User does not Exist.");
            }
            
            return res.send({user});

        } catch (err) {
            console.error(err.message);
            res.status(500).send( 'Server Error')
        }
    }

    async deleteUser(req, res){
        const id = req.params.id
        console.log(id)
        try {

            let user = await User.findById(id)

            if(!user){
                return res.send("User does not Exist.");
            }
            user.flag = 'False'
            await user.save();
            res.status(200).json({'msg': 'Deleted User Successfully'})
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error')
        }
        
    }

    async updateUser(req, res){
        const {name , email, password, userRole} = req.body;

        let errors = []

        if(!name){
            errors.push('First name');
        }
        if(!email){
            errors.push('Email');
        }   
        if(!password){
            errors.push('Password');
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
            let user = await User.findById(id);
            if (!user) {
                return res.send("User does not Exist.");
            }

            user.name = name;
            user.email = email;
            user.password = password;
            user.userRole = userRole;

            let salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save();

            res.status(200).send('User Updated')
            
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error')
        }
    }

    
}

module.exports = new Controllers();