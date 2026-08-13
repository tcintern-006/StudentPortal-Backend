const jwt = require("jsonwebtoken");

const protect = (req , res , next)=>{

    const token = req.cookies.token;
    
    if(!token){
       return  res.status(401).json({message: 'Not authincated'})
    }

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        )

        req.user = decoded
        next()
        
    } catch (error) {
        console.log(error)
       res.status(401).json({ message: 'Invalid or expired token' });
    }

}


module.exports = protect;