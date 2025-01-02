import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    rollno: {
        type: String,
        required: true,
        unique: true
    },
    branch: {
        type: String,
        required: true,
    },
    batch: {
        type: String,
        required: true
    }
});

studentSchema.methods.generateAccessToken = async function () {
    const student = this;
    const token = jwt.sign({ _id: student._id.toString() }, process.env.JWT_SECRET);
    return token;
}

studentSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

studentSchema.methods.generateRefreshToken = async function () {
    const student = this;
    const refreshToken = jwt.sign({ _id: student._id.toString() }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return refreshToken;
}

studentSchema.statics.hashPassword = async function (password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}

const Student = mongoose.model('Student', studentSchema);

export default Student;