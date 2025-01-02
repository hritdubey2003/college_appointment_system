import mongoose from "mongoose";

const availabilitySchema = new mongoose.Schema({
    professor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Professor',
        required: true
    },
    date: {
        type: String,
        required: true
    },
    time_slot: {
        type: [String],
        required: true
    }
}, [{ timestamps: true }]);

const Availability = mongoose.model('Availability', availabilitySchema);

export default Availability