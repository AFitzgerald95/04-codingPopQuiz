// Variables to track quiz state
var questionIndex = 0;
// var time = questionsArr.length * 15;
var timerId;

// DOM Elements
var questionsEl = document.getElementById('question');
var timerEl = document.getElementById('time');
var startBtn = document.getElementById('startBtn');
var submitBtn = document.getElementById('submitBtn');
var initialsEl = document.getElementById('initials');
var feedbackEl = document.getElementById('feedback');
var choicesEl = document.getElementById('choices');

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

var time = questionsArr.length * 15;

function startQuiz() {
    // hides the start screen
    var startScreenEl = document.getElementById('start-screen');
    startScreenEl.setAttribute('class', 'hide');

    // un-hide questions section
    questionsEl.removeAttribute('class');

    // start timer
    timerId = setInterval(clockTick, 1000);

    // show starting time
    timerEl.textContent = time;

    getQuestion();
}

function getQuestion() {
    // get current question from question bank
    var currentQuestion = questionsArr[questionIndex];

    // update title with current question
    var titleEl = document.getElementById('question-title');
    titleEl.textContent = currentQuestion.title;

    // clear old question choices
    choicesEl.innerHTML = '';

    // loop over choices
    for (var i = 0; i < currentQuestion.choices.length; i++) {
        // creates a new button for each choice
        var choice = currentQuestion.choices[i];
        var choiceNode = document.createElement('button');
        choiceNode.setAttribute('class', 'choice');
        choiceNode.setAttribute('value', choice);

        choiceNode.textContent = choice;

        // display on the page
        choicesEl.appendChild(choiceNode);
    }
}

function questionClick(event) {
  var buttonEl = event.target;

//   if the clicked element is not a choice button, do nothing.
if (!buttonEl.matches('.choice')) {
    return;
}

//   check if user guessed wrong
if (buttonEl.value !== questionsArr[questionIndex].answer) {
// penalize time
time -= 15;

if (time < 0) {
    time = 0;
}

// display new time
timerEl.textContent = time;

feedbackEl.textContent = 'Wrong!';
} else {
feedbackEl.textContent = 'Correct!';
}

// flash right/wrong feedback
feedbackEl.setAttribute('class', 'feedback');
setTimeout(function () {
    feedbackEl.setAttribute('class', 'feedback hide');
}, 1000);

// Move to Next Question
questionIndex++;

// check if there are no more questions
if (time <= 0 || questionIndex === questionsArr.length) {
    quizEnd();
} else {
    getQuestion();
}
}

function quizEnd() {
    // stop timer
    clearInterval(timerId);

    //show end screen
    var endScreenEl = document.getElementById('end-screen');
    endScreenEl.removeAttribute('class');

    // show final score
    var finalScoreEl = document.getElementById('final-score');
    finalScoreEl.textContent = time;

    // hide questions section
    questionsEl.setAttribute('class', 'hide');
}

function clockTick() {
    // update time
    time--;
    timerEl.textContent = time;

    // check if user ran out of time
    if (time <= 0) {
        quizEnd();
    }
}

function saveHighscore() {
    // get value of input box
    var initials = initialsEl.value.trim();

    //make sure value wasnt empty
    if (initials !== '') {
        // get saved scores from localstorage, or if not any set to empty array
        var highscores = 
        JSON.parse(window.localStorage.getItem('highscores')) || [];

        // format new score object for current user
        var newScore = {
            score: time,
            initials: initials,
        };

        // save to localstorage
        highsccores.push(newscore);
        window.localStorage.setItem('highscores', JSON.stringify(highscores));

        // redirect to next page
        window.location.href = 'scores.html';
    }
}

function checkForEnter(event) {
    // "13" represents the enter key
    if (event.key === 'Enter') {
        saveHighscore();
  }
}

// user clicks button to submit initials
submitBtn.onclick = saveHighscore;

// user click button to start quiz
startBtn.onclick = startQuiz;

// user clicks on element containing choices
choicesEl.onclick = questionClick;

initialsEl.onkeyup = checkForEnter;

function printHighscores() {
    // either get scores from localstorage or set to empty array
    var highscores = JSON.parse(window.localStorage.getItem('highscores')) || [];

    // sort highscores by score property in descending order
    highscores.sort(function (a, b) {
        return b.score - a.score;
    });

    for (var i = 0; i < highscores.length; i += 1) {
        // create li tag for each input score
        var liTag = document.createElement('li');
        liTag.textContent = highscores[i].initials + ' - ' + highscores[i].score;

        // display on page
        var olEl = document.getElementById('highscores');
        olEl.appendChild(liTag);
    }
}

function clearHighscores()  {
    window.localStorage.removeItem('highscores');
    window.location.reload();
}

document.getElementById('clear').click = clearHighscores;

// run function when page loads
printHighscores();