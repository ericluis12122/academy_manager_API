import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required']
    },
    exam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exam',
        required: [true, 'Exam is required']
    },
    score: {
        type: Number,
        required: [true, 'Score is required'],
        min: [0, 'Score must be at least 0']
    },
    date: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

const Result = mongoose.model('Result', resultSchema);

export default Result;