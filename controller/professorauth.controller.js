import Professor from "../models/professor.model.js";
import Availability from "../models/availability.model.js";


export const registerProfessor = async ( req , res ) => {
    const { name , email , password , department } = req.body;

    try {
        if ( !name || !email || !password || !department ) {
            res.status(400).json({ message: "Please fill all the fields!" });
        }
        
        const professorExists = await Professor.findOne({ email });

        if ( professorExists ) {
            res.status(400).json({ message: "Email already exists!" });
        }

        const hashedPassword = await Professor.hashPassword(password);

        const professor = await Professor.create({
            name,
            email,
            password: hashedPassword,
            department
        });

        const token = await professor.generateAccessToken();
        const refreshToken = await professor.generateRefreshToken();

        return res.status(201).json({
            professor: {
                name: professor.name,
                email: professor.email,
                department: professor.department
            },
            token,
            refreshToken
        });

    } catch ( error ) {
        console.log( error );
        res.status(500).json({ message: "Registration is unsuccessful!" });
    }
}

export const loginProfessor = async( req , res ) => {
    const { email , password } = req.body;
    console.log( email , password );

    try {
        if ( !email || !password ) {
            res.status(400).json({ message: "Please fill all the fields!" });
        }

        const professor = await Professor.findOne({ email });

        if ( !professor ) {
            res.status(400).json({ message: "There is no one with this email!" });
        }

        const isMatch = await professor.matchPassword( password );

        if ( !isMatch ) {
            res.status(400).json({ message: "Password is incorrect!" });
        }

        const token = await professor.generateAccessToken();
        const refreshToken = await professor.generateRefreshToken();

        res.cookie("token" , token , { httpOnly: true , maxAge: 24 * 60 * 60 * 1000 });
        res.cookie("refreshToken" , refreshToken , { httpOnly: true , maxAge: 24 * 60 * 60 * 1000 });

        return res.status(200).json( { "professor": professor , token , refreshToken } );
    } catch ( error ) {
        console.log( error );
        res.status(500).json({ message: "Login is unsuccessful!" });
    }
}

export const setAvailability = async ( req , res ) => {
    try {
        const { day , startTime , endTime } = req.body;

        if ( !day || !startTime || !endTime ) {
            res.status(400).json({ message: "Please fill all the fields!" });
        }

        const professor = await Professor.findById( req.user._id );
        if ( !professor ) {
            res.status(401).json({message: "You are not Authorized to set availability of this!" });
        }

        const time_slot = `${startTime}-${endTime}`;
        console.log( time_slot );

        const existingAvailability = await Availability.findOne({
            professor: professor._id,
            date: day
        });

        if ( existingAvailability ) {
            if ( !existingAvailability.time_slot.includes(time_slot) ) {
                existingAvailability.time_slot.push(time_slot);

                await existingAvailability.save();

                return res.status(200).json({ Availability: existingAvailability });
            } else {
                return res.status(400).json({message: "Time Slot is already added!" });
            }
        } else {
            const availability = await Availability.create({
                professor: professor._id,
                date: day,
                time_slot: [time_slot]
            });

            return res.status(201).json({ availability: availability });
        }
        
    } catch ( error ) {
        console.log( error );
        res.status(500).json({ message: "Process of setting availability is unsuccessful!" });
    }
}

export const deleteTimeSlot = async (req, res) => {
    try {
        const { day, startTime, endTime } = req.body;

        if (!day || !startTime || !endTime) {
            return res.status(400).json({ message: "Please fill all the fields!" });
        }

        // Find the professor based on the ID from the token
        const professor = await Professor.findById(req.user._id);
        if (!professor) {
            return res.status(401).json({ message: "You are not authorized to delete availability!" });
        }

        // Format the time slot as a string
        const time_slot = `${startTime}-${endTime}`;

        // Find the existing availability for the professor on the given day
        const existingAvailability = await Availability.findOne({
            professor: professor._id,
            date: day // Searching for the availability based on the day
        });

        if (!existingAvailability) {
            return res.status(404).json({ message: "No availability found for this day!" });
        }

        // Check if the time slot exists in the professor's availability
        const index = existingAvailability.time_slot.indexOf(time_slot);
        
        if (index === -1) {
            return res.status(404).json({ message: "This time slot does not exist!" });
        }

        // Remove the time slot from the array
        existingAvailability.time_slot.splice(index, 1);

        // Save the updated availability document
        await existingAvailability.save();

        return res.status(200).json({ message: "Time slot deleted successfully!", availability: existingAvailability });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Process of deleting time slot is unsuccessful!" });
    }
};



export const logoutProfessor = async( req , res ) => {
    try {
        res.clearCookie("token");
        res.clearCookie("refreshToken");
        return res.status(200).json({ message: "Logout is successful!" });
    } catch ( error ) { 
        console.log( error );
        res.status(500).json({ message: "Logout is unsuccessful!" });
    }
}