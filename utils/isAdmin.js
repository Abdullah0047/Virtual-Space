
module.exports = async function (req,res,next) {
    const id = req.user.id
    
    if (req.user.userRole !== 'admin') {
        return res.status(400).json({msg:'The User is not admin'});
    }
    next();
}