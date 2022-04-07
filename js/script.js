(async function () {
    function buildQuiz() {
        // variable to store the HTML output
        const output = [];

        // for each question...
        question_bank.sections.forEach(
            (currentSection, SectionNumber) => {
                output.push(`<div class="section">${currentSection.section_number} - ${currentSection.section}</div><br>`);
                
                currentSection.questions.forEach(
                    (currentQuestion, questionNumber) => {

                        // variable to store the list of possible answers
                        const answers = [];
                        
                        shuffledKeys = [];
                        for(i in currentQuestion.answers){shuffledKeys.push(i)}
                        shuffledKeys = shuffledKeys.sort((a, b) => 0.5 - Math.random())

                        // and for each available answer...
                        index = 1;
                        for (key in shuffledKeys) {

                            answerKey = shuffledKeys[key]
                            // ...add an HTML radio button
                            answers.push(
                                `<label class="answer-label">
                                <input type="radio" name="question_${currentSection.section_number + '_' + currentQuestion.index}" value="${answerKey}">
                                ${currentQuestion.answers[answerKey]}
                                </label>`
                            );
                            index++
                        }

                        // add this question and its answers to the output
                        output.push(
                            `<div class="question-box">
                            <div class="question">${currentSection.section_number}.${currentQuestion.index} ${currentQuestion.question} </div>
                            <div class="answers"> ${answers.join('')} </div>
                            </div>`
                        );
                    }
                )
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

        answerSheet = 0
        // for each question...
        question_bank.sections.forEach(
            (currentSection, SectionNumber) => {
                currentSection.questions.forEach((currentQuestion, questionNumber) => {

                // find selected answer
                const answerContainer = answerContainers[answerSheet];
                const selector = `input[name=question_${currentSection.section_number + '_' + currentQuestion.index}]:checked`;
                const userAnswer = (answerContainer.querySelector(selector) || {}).value;

                // if answer is correct
                if (userAnswer === currentQuestion.correctAnswer) {
                    // add to the number of correct answers
                    numCorrect++;

                    // color the answers green
                    answerContainers[answerSheet].style.color = '#008000';
                }
                // if answer is wrong or blank
                else {
                    // color the answers red
                    answerContainers[answerSheet].style.color = 'red';
                }
                answerSheet++
            })
        });

        // show number of correct answers out of total
        resultsContainer.innerHTML = `${numCorrect} out of ${answerSheet}`;
    }

    const quizContainer = document.getElementById('quiz');
    const resultsContainer = document.getElementById('results');
    const submitButton = document.getElementById('submit');
    
    async function loadQuestions(path, questions) {
        const response = await fetch(path);
        const json = await response.json();
        return json;
    }

    question_bank = Object()
    question_bank.sections = []
    question_bank.sections.push(await loadQuestions("data/s-1.json"));
    question_bank.sections.push(await loadQuestions("data/s-2.json"));
    question_bank.sections.push(await loadQuestions("data/s-3.json"));
    question_bank.sections.push(await loadQuestions("data/s-4.json"));
    question_bank.sections.push(await loadQuestions("data/s-5.json"));
    question_bank.sections.push(await loadQuestions("data/s-6.json"));

    // Kick things off
    buildQuiz();

    // Event listeners
    submitButton.addEventListener('click', showResults);
})();