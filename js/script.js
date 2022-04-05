(async function () {
    function buildQuiz() {
        // variable to store the HTML output
        const output = [];

        // for each question...
        question_bank.questions.forEach(
            (currentQuestion, questionNumber) => {

                // variable to store the list of possible answers
                const answers = [];
                
                shuffledKeys = [];
                for(i in currentQuestion.answers){shuffledKeys.push(i)}
                shuffledKeys = shuffledKeys.sort((a, b) => 0.5 - Math.random())

                // and for each available answer...
                index = 1;
                for (key in shuffledKeys) {

                    letter = shuffledKeys[key]
                    // ...add an HTML radio button
                    answers.push(
                        `<label>
                        <input type="radio" name="question${currentQuestion.index}" value="${letter}">
                        ${index} :
                        ${currentQuestion.answers[letter]}
                        </label>`
                    );
                    index++
                }

                // add this question and its answers to the output
                output.push(
                    `<div class="question"> ${currentQuestion.question} </div>
                    <div class="answers"> ${answers.join('')} </div>`
                );
            }
        );

        // finally combine our output list into one string of HTML and put it on the page
        quizContainer.innerHTML = output.join('');
    }

    function showResults() {

        // gather answer containers from our quiz
        const answerContainers = quizContainer.querySelectorAll('.answers');

        // keep track of user's answers
        let numCorrect = 0;

        // for each question...
        question_bank.questions.forEach((currentQuestion, questionNumber) => {

            // find selected answer
            const answerContainer = answerContainers[questionNumber];
            const selector = `input[name=question${currentQuestion.index}]:checked`;
            const userAnswer = (answerContainer.querySelector(selector) || {}).value;

            // if answer is correct
            if (userAnswer === currentQuestion.correctAnswer) {
                // add to the number of correct answers
                numCorrect++;

                // color the answers green
                answerContainers[questionNumber].style.color = 'lightgreen';
            }
            // if answer is wrong or blank
            else {
                // color the answers red
                answerContainers[questionNumber].style.color = 'red';
            }
        });

        // show number of correct answers out of total
        resultsContainer.innerHTML = `${numCorrect} out of ${question_bank.questions.length}`;
    }

    const quizContainer = document.getElementById('quiz');
    const resultsContainer = document.getElementById('results');
    const submitButton = document.getElementById('submit');
    
    async function loadQuestions(path, questions) {
        const response = await fetch(path);
        const json = await response.json();
        return json;
    }

    question_bank = await loadQuestions("data/s-1.json");

    // Kick things off
    buildQuiz();

    // Event listeners
    submitButton.addEventListener('click', showResults);
})();