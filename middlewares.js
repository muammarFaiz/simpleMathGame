const {createHash} = await import("node:crypto");

// "always program defendsively" any foreign data have a chance to be malicious.
export function validateUserInput(req, res, next) {
    if (!req.body.username || !req.body.password) {
        // this will always be defined if the user use the frontend app
        // because on html form submit the untouched input will be sent as empty string
        // input can also have "required" property
        console.log("username or password is undefined");
        // rfv = rejection from validateUserInput
        return next("rfv: username/password empty");
    }
    if ((req.body.username + req.body.password).match(/[!@#\$%\^&*()=+,\./<>?;':"\[\]\\{}|]/)) {
        console.log("username or password contain special character");
        return next("rfv: input invalid");
    }
    if (req.body.username.length > 50 && req.body.password.length > 50) {
        console.log("username or password length is above 50 characters");
        return next("rfv: input invalid");
    }
    console.log("input passed validateUserInput middleware");
    return next();
}
export function comparePassWithDatabase(pool) {
    return async (req, res, next) => {
        try {
            const hash = createHash("sha256");
            hash.update(req.body.password);
            const passwordHash = hash.digest("base64");
            const queryRes = await pool.query(
                "SELECT * FROM basicmathgame_users WHERE username = $1", [req.body.username]
            );
            if (queryRes.rows.length !== 1) {
                console.log("username not found in database");
                return next("rejection from comparePassWithDatabase");
            }
            if (queryRes.rows[0].password !== passwordHash) {
                console.log("username found but password incorrect");
                return next("rejection from comparePassWithDatabase");
            }
            console.log("input passed comparePassWithDatabase middleware");
            return next();
        } catch (err) {
            console.log("error in comparePassWithDatabase middleware");
            return next(err);
        }
    }
};
export function goIfLoggedin(req, res, next) {
    if (req.session.userStatus == "login success") return next();
    else return next("rejection from goIfLoggedin");
}
export function changeQuestionIfTrue(req, res, next) {
    if (!req.session.changeQuestion) return next();
    const operators = ["&divide;", "&times;", "&plus;", "&minus;"];
    req.session.gameEjsObject = generateQuestion();
    return next();
    
    function generateQuestion() {
        let gameDifficulity = req.session.difficulity;
        const gameObj = {
            number1: undefined,
            number2: undefined,
            operator: operators[randomize(3)]
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
        if (gameObj.operator == operators[0]) {
            if (gameObj.number1 == 0) gameObj.number1 = 1;
            if (gameObj.number2 == 0) gameObj.number2 = 1;
        }
        return gameObj;
    }
    // maximum max value is 999999999999999 which is 15 digits, because Math.random() only return 16 digits after decimal separator.
    // therefore the maximum random value is 1e+15 achieved if Math.random() return its max value: 0.9999999999999999
    function randomize(max, min) {
        const percentage = Math.random();
        let randomFloat;
        if (typeof min === "number" && min > 0) {
            randomFloat = min + ((max - min) * percentage);
        }
        if (typeof max === "number" && max > 1) {
            if (typeof min === "number" && min > 0) {
                randomFloat = min + ((max - min) * percentage);
            } else {
                randomFloat = max * percentage;
            }
        }
        return Math.round(randomFloat);
    }
}