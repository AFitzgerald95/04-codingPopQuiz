// Questions Array
var questionsArr = [
    {
        title: 'What does HTML stand for?',
        choices: ['Hyperlink and Text Markup Language','Hyper Text Markup Language','High-Level Text Markup Language','Hyper Transfer Markup Language'],
        answer: 'Hyper Text Markup Language',
    },
    {
        title: 'Which of the Following is used to apply styles directly to an HTML element in CSS?',
        choices: ['.class','#id','tag','inline styles'],
        answer: 'inline styles',
    },
    {
        title: 'What keyword is used to declare a variable in JavaScript?',
        choices: ['var','int','variable','v'],
        answer: 'var',
    },
    {
        title: 'Which HTML tag is used for creating an ordered list?',
        choices: ['<ol>','<ul>','<li>','<list>'],
        answer: '<ol>',
    },
    {
        title: 'What is the purpose of the `querySelector` method in JavaScript?',
        choices: ['To select multiple elements in the document','To select the first element that matches a specified CSS selector','To select all elements with a specific class name','To select elements based on their tag names'],
        answer: 'To select elements based on their tag names',
    },
];

// DOM Elements
var highScoresEl = document.getElementById('highScores');
var timerEl = document.getElementById('time');
var startScreenEl = document.getElementById('startScreen');
var startBtnEl = document.getElementById('startBtn');
var questionScreenEl = document.getElementById('questionScreen');
var questionTitleEl = document.getElementById('questionTitle');
var questionChoicesEl = document.getElementById('questionChoices');
var endScreenEl = document.getElementById('endScreen');
var finalScoreEl = document.getElementById('finalScore');
var initialsEl = document.getElementById('initials');
var submitBtnEl = document.getElementById('submitBtn');
var resultsEl = document.getElementById('results');

var currentQuestionIndex = 0;
var score = 0;
var time = questionsArr.length * 15;
var timer;

function startQuiz() {
    
    startScreenEl.style.display = "none";
    questionScreenEl.style.display = "block";   
    endScreenEl.style.display = "none";
    timerEl.classList.remove('hide');

    startTimer();

    updateTimerDisplay();

    displayQuestion();
}

function startTimer() {
    timer = setInterval(function () {
        // Decreases time by 1 second
        time--;

        // Updates the timer display in the HTML document
        updateTimerDisplay();

        // Checks to see if the time is up
        if (time <= 0) {

            // Stops the timer
            clearInterval(timer);

            endQuiz();
        }
    }, 1000);
}

function updateTimerDisplay() {
    // Displays the current time in the HTML element
    timerEl.textContent = time;
}

function displayQuestion() {

    var currentQuestion = questionsArr[currentQuestionIndex];

    questionTitleEl.textContent = currentQuestion.title;

    questionChoicesEl.innerHTML = '';

    for (var i = 0; i < currentQuestion.choices.length; i++) {
        var choiceBtnEl = document.createElement('button');
        choiceBtnEl.textContent = currentQuestion.choices[i];
        choiceBtnEl.addEventListener('click', handleChoice);
        questionChoicesEl.appendChild(choiceBtnEl);
    }
}

function handleChoice(event) {
    // Gets the text content of the selected choice
    var selectedChoice = event.target.textContent;

    // Checks if the selected choice is correct
    var isCorrect = selectedChoice === questionsArr[currentQuestionIndex].answer;

    // Subtracts 10 seconds if the answer is incorrect
    if (!isCorrect) {
        time -= 10;

        // Makes sure the timer doesn't go below 0
        if (time < 0) {
            time = 0;
        }
    }

    setTimeout(function () {
        // Displays feedback
        var feedbackMessage = isCorrect ? 'Correct!' : 'Incorrect!';
            displayFeedback(feedbackMessage);

        // Moves to the next question
            currentQuestionIndex++;

        // Checks if there are more questions
            if (currentQuestionIndex < questionsArr.length) {

        // Displays the next question after a short delay
            setTimeout(displayQuestion, 1000);
        } else {
        // If there are no more questions, end the quiz
        setTimeout(function () {
            // Stops the timer when the final question is answered
            clearInterval(timer);
            endQuiz();

            var initials = document.getElementById('initials').ariaValueMax;
            saveScore(initials, time);
            }, 1000);
        }
     }, 1000);
}

function displayFeedback(message) {
    // Creates a feedback element
    var feedbackEl = document.createElement('div');
    feedbackEl.textContent = message;

    //Appends it to the results container
    resultsEl.appendChild(feedbackEl);

    //Clears the feedback after a short delay
    setTimeout(function () {
        resultsEl.removeChild(feedbackEl);
    }, 1000);
}

function endQuiz() {
    clearInterval(timer);
    isQuizOver = true;
    questionScreenEl.style.display = "none";
    endScreenEl.style.display = "block";
    finalScoreEl.textContent = time;
    timerEl.classList.add('hide');
    
    var initials = document.getElementById('initials').value;
    saveScore(initials, time);
    displayHighScores();
}

function saveScore(initials, score) {
    var highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    highScores.push({initials: initials, score: score});
    highScores.sort((a, b) => b.score - a.score);
    localStorage.setItem('highScores', JSON.stringify(highScores));
}

function displayHighScores() {
    var highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    var highScoreList = document.getElementById('highScoresList');

    highScoreList.innerHTML = '';

    highScores.forEach(function (score) {
        var li = document.createElement('li');
        li.textContent = score.initials + ': ' + score.score;
        highScoreList.appendChild(li);
    });
}

submitBtnEl.addEventListener('click', function() {
    var initials = document.getElementById('initials').value;
    if (initials.trim() !== '') {
        saveScore(initials, time);
        displayHighScores();
    }
});

startBtnEl.addEventListener('click', startQuiz);