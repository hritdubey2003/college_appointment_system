import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    professor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Professor',
        required: true
    },
    date: {
        type: String,
        required: true
    },
    availability: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Availability',
        required: true
    },
    "timeSlot": {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Booked' , 'Available' , 'Cancelled'],
        required: true
    }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;