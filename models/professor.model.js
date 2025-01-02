import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const professorSchema = new mongoose.Schema({
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
    department: {
        type: String,
        required: true
    }
});

professorSchema.methods.generateAccessToken = async function () {
    const professor = this;
    const token = jwt.sign({ _id: professor._id.toString() }, process.env.JWT_SECRET);
    return token;
}

professorSchema.methods.generateRefreshToken = async function () {
    const professor = this;
    const refreshToken = jwt.sign({ _id: professor._id.toString() }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return refreshToken;
}

professorSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

professorSchema.statics.hashPassword = async function (password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}

const Professor = mongoose.model('Professor', professorSchema);

export default Professor