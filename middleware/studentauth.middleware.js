import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config()

export const studentAuth = ( req , res , next ) => {
    try {
        const token = req.cookies.token;
        if ( !token ) {
            return res.status(401).json({ message: "You are not logged in!" });
        }

        const user = jwt.verify(token , process.env.JWT_SECRET );
        req.user = user;
        next();
    } catch ( error ) {
        console.log( error );
        res.status(401).json({ message: "You are not authorized to set-availability for others!"});
    }
}