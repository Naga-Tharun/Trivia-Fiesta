require('dotenv').config();
const OpenAI = require("openai");

module.exports.generateQuestions = async function(req, res){

    const openai = new OpenAI({
        apiKey: process.env.OPENAI_APIKEY
    });

    let categories = req.body.categories.split(", ");
    console.log(categories);
    let categoriesString = categories.join(", ");
    console.log(categoriesString);
    let numQuestions = req.body.numQuestions;

    const question = "Generate a total of " + numQuestions + " mcqs based on the following categories: " + categoriesString + ' and provide the correct answer for each mcq, represent the mcqs in the following json format [{"category": "value", "question": "question 1", "options": ["option 1", "option 2", "option 3", "option 4"], "correct_answer": "answer"}]. ';

    const completion = await openai.chat.completions.create({
        messages: [
          { 
            role: 'user',
            content: question
          }
        ],
        model: 'gpt-3.5-turbo',
    });

    console.log(completion.choices[0].message.content);

    const questionsData = completion.choices[0].message.content;

    return res.json(JSON.parse(questionsData));

}