// Quiz questions and answers
const quizData = [
    {
        question: 'What does the term "Full Stack Development" refer to?',
        options: [
            "Development that involves stack data structures",
            "Development that involves front-end and back-end programming",
            "Development that involves back-end programming",
            "None of above"
        ],
        answer: "Development that involves front-end and back-end programming"
    },
    {
        question: "CRUD stands for?",
        options: [
            "Create, Read, Upload, Delete",
            "Create, Read, Upgrade, Deploy",
            "Create, Remove, Upgrade, Delete",
            "Create, Read, Update, Delete"
        ],
        answer: "Create, Read, Update, Delete"
    },
    {
        question: "Which of the following is used to style web pages?",
        options: [
            "HTML",
            "JavaScript",
            "CSS",
            "Python"
        ],
        answer: "CSS"
    },
    {
        question: "Which protocol is used to secure data transfer over the internet?",
        options: [
            "HTTP",
            "FTP",
            "HTTPS",
            "SMTP"
        ],
        answer: "HTTPS"
    },
    {
        question: "What does the acronym 'DOM' stand for?",
        options: [
            "Document Object Model",
            "Data Object Model",
            "Digital Object Management",
            "Dynamic Object Model"
        ],
        answer: "Document Object Model"
    }
];

let currentQuestion = 0;
let score = 0;
let questionTimer;
let overallTimeLeft = 900; // 15 minutes (900 seconds)
let questionTimeLeft = 60; // 60 seconds per question
let userAnswers = new Array(quizData.length).fill(null); // Store selected answers

const quizSection = document.getElementById("quiz-section");
const quizContainer = document.getElementById("quiz");
const questionTimerElement = document.getElementById("question-timer");
const overallTimerElement = document.getElementById("overall-timer");
const startButton = document.getElementById("start");
const prevButton = document.getElementById("prev");
const submitButton = document.getElementById("submit");

// Start Quiz
startButton.addEventListener("click", startQuiz);
prevButton.addEventListener("click", prevQuestion);
submitButton.addEventListener("click", submitQuiz);

function startQuiz() {
    startButton.style.display = "none";
    quizSection.style.display = "block";
    loadQuestion();
    startOverallTimer();
    startQuestionTimer();
}

function loadQuestion() {
    quizContainer.innerHTML = "";
    const item = quizData[currentQuestion];

    const questionDiv = document.createElement("div");
    questionDiv.classList.add("question");
    questionDiv.innerHTML = `<p>${currentQuestion + 1}. ${item.question}</p>`;

    const optionsDiv = document.createElement("div");
    optionsDiv.classList.add("options");

    item.options.forEach(option => {
        const optionLabel = document.createElement("label");
        optionLabel.innerHTML = `
            <input type="radio" name="question" value="${option}" ${userAnswers[currentQuestion] === option ? "checked" : ""}> 
            ${option}
        `;
        optionsDiv.appendChild(optionLabel);
    });

    questionDiv.appendChild(optionsDiv);
    quizContainer.appendChild(questionDiv);

    // Disable "Previous" on the first question
    prevButton.disabled = currentQuestion === 0;

    // Change submit button text for the last question
    submitButton.innerText = currentQuestion === quizData.length - 1 ? "Submit Quiz" : "Next";
}

function startQuestionTimer() {
    clearInterval(questionTimer);
    questionTimeLeft = 60;
    questionTimerElement.innerText = `Time Left for Question: ${questionTimeLeft}s`;

    questionTimer = setInterval(() => {
        if (questionTimeLeft > 0) {
            questionTimeLeft--;
            questionTimerElement.innerText = `Time Left for Question: ${questionTimeLeft}s`;
        } else {
            clearInterval(questionTimer);
            if (currentQuestion < quizData.length - 1) {
                nextQuestion();
            } else {
                submitQuiz();
            }
        }
    }, 1000);
}

function startOverallTimer() {
    const overallTimer = setInterval(() => {
        if (overallTimeLeft > 0) {
            overallTimeLeft--;
            let minutes = Math.floor(overallTimeLeft / 60);
            let seconds = overallTimeLeft % 60;
            overallTimerElement.innerText = `Total Time Left: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        } else {
            clearInterval(overallTimer);
            submitQuiz();
        }
    }, 1000);
}

function saveAnswer() {
    const selectedOption = document.querySelector('input[name="question"]:checked');
    if (selectedOption) {
        userAnswers[currentQuestion] = selectedOption.value;
    }
}

function prevQuestion() {
    saveAnswer();
    if (currentQuestion > 0) {
        currentQuestion--;
        loadQuestion();
        startQuestionTimer();
    }
}

function submitQuiz() {
    saveAnswer();

    if (currentQuestion < quizData.length - 1) {
        currentQuestion++;
        loadQuestion();
        startQuestionTimer();
    } else {
        clearInterval(questionTimer);
        clearInterval(overallTimeLeft);

        score = userAnswers.reduce((total, answer, index) => {
            return answer === quizData[index].answer ? total + 1 : total;
        }, 0);

        document.getElementById("result").innerHTML = `You scored ${score} out of ${quizData.length}!`;
        alert(`Quiz Completed! You scored ${score} out of ${quizData.length}!`);
    }
}
