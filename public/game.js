
const ELEMENTS = {
    difficulityForm: document.querySelector("#difficulity_form"),
    gameForm: document.querySelector("#game"),
    number1Span: document.querySelector("#number1"),
    number2Span: document.querySelector("#number2"),
    modSpan: document.querySelector("#mod"),
    warningSpan: document.querySelector("#warning"),
    answerInput: document.querySelector("#answer"),
    loginForm: document.querySelector("#login_form"),
    registerForm: document.querySelector("#register_form"),
    toRegButton: document.querySelector("#to_register"),
    toLoginButton: document.querySelector("#to_login")
}
const MATH_SYMBOLS = ["&divide;", "&times;", "&plus;", "&minus;"];

let gameObject = {
    number1: undefined,
    number2: undefined, 
    operator: undefined
};
let gameDifficulity;
let currentQuestion;


ELEMENTS.difficulityForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const userFormData = new FormData(event.target);
    const userInputObject = Object.fromEntries(userFormData.entries());
    if ("difficulity" in userInputObject) {
        gameDifficulity = userInputObject.difficulity;
        ELEMENTS.gameForm.classList.remove("hide");
        ELEMENTS.difficulityForm.classList.add("hide");
        gameObject = refreshGameForm();
    }
});
ELEMENTS.gameForm.addEventListener("submit", (event) => {
    event.preventDefault();
    ELEMENTS.warningSpan.textContent = "";
    const userFormData = new FormData(event.target);
    const userInputObject = Object.fromEntries(userFormData.entries());
    console.log(userInputObject);
    if (userInputObject.userAnswer.length > 0) {
        handleUserAnswer(userInputObject.userAnswer);
    } else {
        ELEMENTS.warningSpan.textContent = "no answer submited";
        console.log("no answer submited");
    }
});
ELEMENTS.toRegButton.addEventListener("click", (event) => {
    event.preventDefault();
    ELEMENTS.loginForm.classList.add("hide");
    ELEMENTS.registerForm.classList.remove("hide");
});
ELEMENTS.toLoginButton.addEventListener("click", (event) => {
    event.preventDefault();
    ELEMENTS.loginForm.classList.remove("hide");
    ELEMENTS.registerForm.classList.add("hide");
});


// functions-------------------------------------------------function------------------------------------------------------functions
function handleUserAnswer(userAnswer) {
    if (userAnswer.match(/[a-zA-Z,<>\/?;:'"\[{\]}\\\/|=+]/)) {
        ELEMENTS.warningSpan.textContent = "unwanted characters";
        console.log("unwanted char");
        return;
    }
    const parsedUserAnswer = parseUserAnswer(userAnswer);
    const correctAnswer = revealCorrectAnswer(gameObject.operator);
    if (parsedUserAnswer !== correctAnswer) {
        ELEMENTS.warningSpan.textContent = "false";
        console.log("false");
        return;
    }
    console.log("true");
    ELEMENTS.answerInput.value = "";
    gameObject = refreshGameForm();
}
function parseUserAnswer(userAnswer) {
    const userAnswerInt = Number.parseFloat(userAnswer, 10);
    console.log(userAnswerInt);
    const userAnswerMaxTwoDecimal = Number.parseFloat(Math.floor(Number.parseFloat(userAnswerInt + "e+2")) + "e-2");
    console.log(userAnswerMaxTwoDecimal);
    return userAnswerMaxTwoDecimal;
}
function revealCorrectAnswer(operator) {
    const correctAnswer = calculateCorrectAnswer(operator);
    const correctAnswerMaxTwoDecimal = Number.parseFloat(Math.floor(Number.parseFloat(correctAnswer + "e+2")) + "e-2");
    console.log(correctAnswerMaxTwoDecimal);
    return correctAnswerMaxTwoDecimal;
}
function calculateCorrectAnswer(mathOperator) {
    let correctAnswer;
    switch (mathOperator) {
        case "&divide;":
            correctAnswer = Number.parseInt(ELEMENTS.number1Span.textContent) / Number.parseInt(ELEMENTS.number2Span.textContent);
        break;
        case "&times;":
            correctAnswer = Number.parseInt(ELEMENTS.number1Span.textContent) * Number.parseInt(ELEMENTS.number2Span.textContent);
        break;
        case "&plus;":
            correctAnswer = Number.parseInt(ELEMENTS.number1Span.textContent) + Number.parseInt(ELEMENTS.number2Span.textContent);
        break;
        case "&minus;":
            correctAnswer = Number.parseInt(ELEMENTS.number1Span.textContent) - Number.parseInt(ELEMENTS.number2Span.textContent);
        break;
        default:
        break;
    }
    return correctAnswer;
}
function refreshGameForm() {
    const mathOperator = MATH_SYMBOLS[randomize(3)];
    const gameObj = {
        number1: undefined,
        number2: undefined,
        operator: mathOperator
    }
    if (gameDifficulity === "easy") {
        gameObj.number1 = randomize(9);
        gameObj.number2 = randomize(9);
    } else if (gameDifficulity === "medium") {
        gameObj.number1 = randomize(9);
        gameObj.number2 = randomize(9);
        gameObj[`number${randomize(2, 1)}`] = randomize(99, 10);
    } else if (gameDifficulity === "hard") {
        gameObj.number1 = randomize(99, 10);
        gameObj.number2 = randomize(99, 10);
    }
    ELEMENTS.number1Span.textContent = gameObj.number1;
    ELEMENTS.number2Span.textContent = gameObj.number2;
    ELEMENTS.modSpan.innerHTML = mathOperator;
    return gameObj;
}
function randomize(max, min) {
    let random = Math.random();
    if (typeof max === "number" && max > 1) {
        random = multiplyRandom(random, max, min);
    }
    return Math.round(random);
}
function multiplyRandom(randomFloat, max,  min) {
    if (typeof min === "number" && min > 0) {
        const gap = randomFloat * (max - min);
        return min + gap;
    } else {
        return randomFloat * max;
    }
}