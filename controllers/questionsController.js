require('dotenv').config();
const OpenAI = require("openai");

const Question = require("../models/question");

module.exports.generateQuestions = async function(req, res){
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_APIKEY
    });

    let categories = req.body.categories.split(", ");
    let categoriesString = categories.join(", ");
    let numQuestions = req.body.numQuestions;

	// check if questions of mentioned category are in database
	try {
		const questionsFromDatabase = await Question.find({ category: { $in: categories } });

		var categoriesExist = true;

		for(const i in categories) {
			const qnFromDb = await Question.find({category: i});
			if(qnFromDb.length == 0) {
				categoriesExist = false;
			}
		}

		if (questionsFromDatabase.length < numQuestions || categoriesExist == false) {
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

			const questionsData = completion.choices[0].message.content;
			addQuestions(questionsData);

			const generatedQuestions = JSON.parse(questionsData);
			const shuffledQuestions = generatedQuestions.sort(() => 0.5 - Math.random());

			return res.json(shuffledQuestions);
		} 
		else {
			const selectedQuestions = await selectRandomQuestions(questionsFromDatabase, numQuestions, categories);

			return res.json(selectedQuestions);
		}
	} catch (error) {
		console.error('Error checking the database:', error);
		
		return res.status(400).send({
            message: false
        });
	}
}

// add questions to the database
function addQuestions(questionData) {
	try {
		const questionObject = JSON.parse(questionData);
	
		for(const i of questionObject) {
			const question = new Question(i);
		
			question.save()
				.catch(error => {
					console.error('Error saving question:', error);
				});
		}
	} catch(error) {
	console.error('Error parsing JSON:', error);
	}
}

// select random questions from the database
function selectRandomQuestions(questions, num, categories) {
	const filteredQuestions = questions.filter((question) => categories.includes(question.category));
    const shuffledQuestions = filteredQuestions.sort(() => 0.5 - Math.random());
	const selectedQuestions = shuffledQuestions.slice(0, num);

	const formattedQuestions = selectedQuestions.map((question) => ({
		category: question.category,
		question: question.question,
		options: question.options,
		correct_answer: question.correct_answer,
	  }));

	console.log(formattedQuestions);
    return formattedQuestions;
};