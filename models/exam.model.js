import mongoose from "mongoose";

const examSchema = new mongoose.Schema({
    title: {
        type: String,
        default: 'Untitle',
        trim: true,
    },
    questions: {
        type: [mongoose.Schema.Types.ObjectId], 
        ref: 'Question',
        required: [true, 'Questions are required'],
    },
    duration: {
        type: Number, 
        default: 60,
        min: [1, 'Duration must be at least 1 minute']
    },
}, { timestamps: true });

const Exam = mongoose.model('Exam', examSchema);

export default Exam;