const mongoose = require('mongoose');

const QuestionSchema = mongoose.Schema({
    // {
    //     "category": "Riddles and Brain Teasers",
    //     "question": "I am not alive, but I can grow; I don't have lungs, but I need air; I don't have a mouth, but water kills me. What am I?",
    //     "options": ["Tree", "Fish", "Fire", "Cloud"],
    //     "correct_answer": "Fire"
    // }

    category: {
        type: String,
        required: true
    },
    question: {
        type: String,
        required: true
    },
    options: {
        type: Array,
        required: true
    },
    correct_answer: {
        type: String,
        required: true
    }
}, {
    // created at and updated at are stored
    timestamps: true
});


const Question = mongoose.model('Question', QuestionSchema);

module.exports = Question;