import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    content: {
        type: String, 
        required: [true, 'Question content is required'],
        trim: true,
    },
    options: {
        type: [String], 
        required: [true, 'Options are required'],
        validate: {
            validator: (value) => value.length >= 2,
            message: 'At least two options are required'
        }
    },
    answer: {
        type: String, 
        required: [true, 'Answer field is required'],
    },
    topic: {
        type: String,
        required: [true, 'Topic field is required']
    }
}, { timestamps: true });

const Question = mongoose.model('Question', questionSchema);

export default Question;