// Start Selecting Elements
let quizArea = document.querySelector(".quiz-area");
let qNums = document.querySelector(".quiz-info p:nth-child(2) span");
let question = document.querySelector(".question h1");
let answersArea = document.querySelector(".answers");
let submitBtn = document.querySelector("button.submit");
let bullets = document.querySelector(".bullets");
let timerArea = document.querySelector(".timer");
// End Selecting Elements

//Define Variables 
let randomizedData = [];
let count = 0;
let rightAnswersCount = 0;
let timer;
let duration = 60;
let rand;


//Getting The Exam JSON File
function getData() {
    let myRequest = new XMLHttpRequest();
    myRequest.onreadystatechange = function () {

        if (this.status === 200 && this.readyState === 4) {
            let data = JSON.parse(myRequest.responseText);
            let numOfOdata = data.length;
            qNums.innerHTML = numOfOdata;
            //Take A Copy Of Questions data To choose questions Randomly
            for (let i = 0; i < numOfOdata; i++) {
                randomizedData[i] = data[i];
            }
            questionMarkers(numOfOdata);
            getQuestionAndAnswers(randomizedData);
            questionDuration(duration);
            //Click On Button Event
            submitBtn.onclick = () => {
                checkAnswer(randomizedData, rand);
                count++;
                clearInterval(timer);

                if (count < numOfOdata) {
                    question.innerHTML = "";
                    answersArea.innerHTML = "";
                    markQuestion(count);
                    getQuestionAndAnswers(randomizedData);
                    questionDuration(duration);
                } else {
                    question.parentElement.remove();
                    answersArea.remove();
                    submitBtn.remove();
                    bullets.parentElement.remove();
                    result(numOfOdata, rightAnswersCount);
                }
            }
        }
    }
    myRequest.open("GET", "html_questions.json", true);
    myRequest.send();
}

getData();

//Define Functions

function questionMarkers(num) {
    for (let i = 0; i < num; i++) {
        let bullet = document.createElement("span");
        if (i === 0) {
            bullet.className = "active";
        }
        bullets.appendChild(bullet);
    }
}
function getQuestionAndAnswers(obj) {
    rand = Math.floor(Math.random() * obj.length);
    question.innerHTML = obj[rand].title;
    getAnswers(obj, rand);
}

function getAnswers(obj, ct) {
    for (let i = 1; i <= 4; i++) {
        let div = document.createElement("div");
        div.className = "answer";
        let radio = document.createElement("input");
        if (i === 1) {
            radio.checked = true;
        }
        radio.type = "radio";
        radio.name = "question";
        radio.dataset.answer = obj[ct][`answer_${i}`];
        radio.id = `answer_${i} `;
        let label = document.createElement("label");
        let answerText = document.createTextNode(obj[ct][`answer_${i}`]);
        label.appendChild(answerText);
        label.htmlFor = `answer_${i} `;
        div.appendChild(radio);
        div.appendChild(label);
        answersArea.appendChild(div);
    }
}

function checkAnswer(obj, ct) {
    let answers = document.querySelectorAll(".answers .answer input[type=radio]");
    answers.forEach((radio) => {
        if (radio.dataset.answer === obj[ct][`right_answer`] && radio.checked === true) {
            rightAnswersCount++;
        }
    });
    obj.splice(rand, 1);
}

function markQuestion(ct) {
    let bullets = document.querySelectorAll(".bullets span");
    bullets.forEach((bullet, index) => {
        if (index === ct) {
            bullet.classList.add("active");
        }
    })
}

function questionDuration(duration) {
    timer = setInterval(() => {
        let minutes = parseInt(duration / 60);
        let seconds = parseInt(duration % 60);
        minutes = minutes < 10 ? `0${minutes}` : minutes;
        seconds = seconds < 10 ? `0${seconds}` : seconds;
        timerArea.innerHTML = `<span>${minutes}</span>:<span>${seconds}</span>`;
        if (--duration < 0) {
            submitBtn.click();
        }
    }, 1000);
}

function result(total, rightCt) {
    let div = document.createElement("div");
    div.className = "result";
    let reloadBtn = document.createElement("button");
    reloadBtn.appendChild(document.createTextNode("Try Again!"));
    reloadBtn.className = "reload";
    let classification;
    if (rightCt > total / 2 && rightCt < total) {
        classification = "<span class= good>good</span>";
    }
    else if (rightCt < total / 2) {
        classification = "<span class= bad>bad</span>";
    }
    else {
        classification = "<span class= excellent>Excellent</span>";
    }
    div.innerHTML = `${classification} You Answered <span>${rightCt}</span> of ${total}`;
    document.body.removeChild(quizArea);
    document.body.appendChild(div);
    document.body.appendChild(reloadBtn);
    reloadBtn.onclick = () => {
        window.location.reload();
    }
}

