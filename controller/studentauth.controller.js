import Student from "../models/student.model.js";
import Availability from "../models/availability.model.js";
import Professor from "../models/professor.model.js";
import Appointment from "../models/appointment.model.js";

export const registerStudent = async (req, res) => {
    const { name, email, password, rollno, branch, batch } = req.body;

    try {
        if ( !name || !email || !password || !rollno || !branch || !batch ) {
            res.status(400).json({ message: "Please fill all the fields!" });
        }

        const studentExists = await Student.findOne({ email });

        if ( studentExists ) {
            res.status(400).json({ message: "Email already exists!" });
        }

        const hashedPassword = await Student.hashPassword(password);

        const student = await Student.create({
            name,
            email,
            password: hashedPassword,
            rollno,
            branch,
            batch
        })

        const token = await student.generateAccessToken();
        const refreshToken = await student.generateRefreshToken();

        return res.status(201).json({
            student: {
                _id: student._id,
                name: student.name,
                email: student.email,
                rollno: student.rollno,
                branch: student.branch,
                batch: student.batch,
            },
            token,
            refreshToken,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error!" });
    }
}

export const loginStudent = async ( req , res ) => {
    const { email , password } = req.body;

    try {
        if ( !email || !password ) {
            return res.status(400).json({ message: "Please fill all the fields!" });
        }

        const student = await Student.findOne({ email });

        if ( !student ) {
            return res.status(400).json({ message: "There is no one with this email!" });
        }

        const isMatch = await student.matchPassword( password );

        if ( !isMatch ) {
            return res.status(400).json({ message: "Password is incorrect!" });
        }

        const token = await student.generateAccessToken();
        const refreshToken = await student.generateRefreshToken();

        res.cookie("token" , token , { httpOnly: true , maxAge: 24 * 60 * 60 * 1000 });
        res.cookie("refreshToken" , refreshToken , { httpOnly: true , maxAge: 24 * 60 * 60 * 1000 });

        return res.status(200).json( { "student": student , token , refreshToken } );
    } catch ( error ) {
        console.log(error);
        return res.status(500).json({ message: "Login is unsuccessful!" });
    }
}

export const getAvailableTimeSlots = async (req, res) => {
    try {
        const professorsAvailability = await Availability.find({});

        if (!professorsAvailability || professorsAvailability.length === 0) {
            return res.status(404).json({ message: 'No professors found!' });
        }

        const professorIds = [...new Set(professorsAvailability.map(item => item.professor))];

        const professors = await Professor.find({ '_id': { $in: professorIds } });

        if (!professors || professors.length === 0) {
            return res.status(404).json({ message: 'No professors found!' });
        }

        const availabilityDetails = professorsAvailability.map(item => {
            const professor = professors.find(p => p._id.toString() === item.professor.toString());
            return {
                professor: {
                    _id: professor._id,
                    name: professor.name,
                    email: professor.email,
                    department: professor.department,
                },
                date: item.date,
                time_slot: item.time_slot
            };
        });

        return res.status(200).json({ availability: availabilityDetails });
    } catch (error) {
        console.log(error);
        res.status(501).json({ message: 'Error in getting available time slots!' });
    }
};

export const bookTimeSlot = async (req, res) => {
    const { professorId, date, timeSlot } = req.body;
    console.log( professorId , date , timeSlot );

    try {
        if (!professorId || !date || !timeSlot) {
            return res.status(400).json({ message: "Please fill all the fields!" });
        }

        const professorAvailability = await Availability.findOne({ professor: professorId, date });

        if (!professorAvailability || !professorAvailability.time_slot.includes(timeSlot)) {
            return res.status(400).json({ message: "This time slot is not available!" });
        }

        const appointment = await Appointment.create({
            student: req.user._id,
            professor: professorId,
            date,
            availability: professorAvailability._id,
            timeSlot,
            status: "Booked",
        });

        professorAvailability.time_slot = professorAvailability.time_slot.filter(slot => slot !== timeSlot);
        await professorAvailability.save();

        return res.status(201).json({ message: "Appointment booked successfully!", appointment });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Booking process is unsuccessful!" });
    }
};

export const cancelAppointment = async (req, res) => {
    const { appointmentId } = req.body;

    try {
        const appointment = await Appointment.findById(appointmentId).populate('availability');

        if (!appointment || appointment.student.toString() !== req.user._id) {
            return res.status(404).json({ message: "Appointment not found or not owned by the user!" });
        }

        appointment.status = "Cancelled";
        await appointment.save();

        const professorAvailability = await Availability.findById(appointment.availability);

        if (!professorAvailability) {
            return res.status(404).json({ message: "Professor availability not found!" });
        }

        const timeSlot = `${appointment.timeSlot}`;
        if (!professorAvailability.time_slot.includes(timeSlot)) {
            professorAvailability.time_slot.push(timeSlot);
        }

        professorAvailability.time_slot.sort();

        await professorAvailability.save();

        if (professorAvailability.time_slot.length === 0) {
            await Availability.findByIdAndDelete(professorAvailability._id);
        }

        await Appointment.findByIdAndDelete(appointment._id);

        return res.status(200).json({ message: "Appointment cancelled successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Cancellation process was unsuccessful!" });
    }
};


export const logoutStudent = async ( req , res ) => {
    try {
        res.clearCookie("token");
        res.clearCookie("refreshToken");

        return res.status(200).json({ message: "Logout is Successful!"});
    } catch ( error ) {
        console.log( error );
        res.status(501).json({message: 'Process for logout is unsuccessfull!'});
    }
}
