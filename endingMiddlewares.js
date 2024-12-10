const {createHash} = await import("node:crypto");

export function getRoot(req, res, next) {
    if (req.session.views) req.session.views++;
    else req.session.views = 1;
    const ejsObject = {
        userStatus: req.session.userStatus
    };
    if (req.session.username) ejsObject.user = req.session.username;
    return res.render("initial.ejs", ejsObject);
}
export async function postLogin(req, res, next) {
    // (regenerate the session, which is good practice to help
    // guard against forms of session fixation) express-session README
    req.session.regenerate((err) => {
        if (err) return next(err);
        req.session.username = req.body.username;
        req.session.userStatus = "login success";
        // (save the session before redirection to ensure page
        // load does not happen before session is saved) express-session README
        req.session.save((err) => {
            if (err) return next(err);
            return res.redirect("/");
        });
    });
}
export function postRegister(pool) {
    return async (req, res, next) => {
        const hash = createHash("sha256");
        hash.update(req.body.password);
        const passwordHash = hash.digest("base64");
        let queryRes;
        try {
            queryRes = await pool.query("INSERT INTO basicmathgame_users (username, password) VALUES ($1, $2)", [req.body.username, passwordHash]);
        } catch (error) {
            return next("")
        }
        if (queryRes.rowCount == 1) {
            // success
            req.session.regenerate((err) => {
                if (err) return next(err);
                req.session.username = req.body.username;
                req.session.userStatus = "register success";
                // save the session before redirection to ensure page
                // load does not happen before session is saved
                req.session.save((err) => {
                    if (err) return next(err);
                    else return res.redirect("/");
                });
            });
        } else {
            return next("register fail, database error");
        }
    }
}
export function getLogout(req, res, next) {
    // saving the session as a logged out before we regenerate
    // the opposite with successful login/register where we regenerate and then save
    // because in successful login/register the previous session do not matter but
    // in logout the previous session contain the info of a logged in user.
    req.session.username = null;
    req.session.save((err) => {
        if (err) next(err);
        req.session.regenerate((regenErr) => {
            if (regenErr) next(regenErr);
            res.redirect("/");
        });
    });
}
export function postDifficulity(req, res, next) {
    const difficulities = ["easy", "medium", "hard"];
    if (difficulities.includes(req.body.difficulity)) {
        req.session.difficulity = req.body.difficulity;
        req.session.changeQuestion = true;
        return res.redirect("/game");
    } else {
        return next("rejection from post/difficulity");
    }
    // TODO: tidy up the code, use typescript
}
export function postValidateAnswer(req, res, next) {
    const userAnswer = req.body.userAnswer;
    console.log(userAnswer);
    if (userAnswer.length > 0) {
        if (userAnswer.match(/[a-zA-Z,<>\/?;:'"\[{\]}\\\/|=+]/)) {
            console.log("unwanted char");
            req.session.changeQuestion = false;
            req.session.gameEjsObject.warning = "unwanted characters";
            return next("game: unwanted characters");
        }
        
        // parse user answer:
        const userAnswerInt = Number.parseFloat(userAnswer, 10);
        console.log(userAnswerInt);
        const parsedUserAnswer = Number.parseFloat(Math.floor(Number.parseFloat(userAnswerInt + "e+2")) + "e-2");
        console.log(parsedUserAnswer);
        
        const correctAnswer = revealCorrectAnswer(req.session.gameEjsObject);
        if (parsedUserAnswer !== correctAnswer) {
            console.log("false");
            req.session.changeQuestion = false;
            req.session.gameEjsObject.warning = "false";
            return next("game: false");
        }
        console.log("true");
        req.session.changeQuestion = true;
        req.session.gameEjsObject.warning = "";
        return res.redirect("/game");
    } else {
        console.log("no answer submited");
        req.session.changeQuestion = false;
        req.session.gameEjsObject.warning = "no answer submited";
        return next("game: no answer submited");
    }

    function revealCorrectAnswer(gameObject) {
        const {number1, operator, number2} = gameObject;
        let correctAnswer;
        switch (operator) {
            case "&divide;":
                correctAnswer = number1 / number2;
            break;
            case "&times;":
                correctAnswer = number1 * number2;
            break;
            case "&plus;":
                correctAnswer = number1 + number2;
            break;
            case "&minus;":
                correctAnswer = number1 - number2;
            break;
            default:
            break;
        }
        // rounding down the correct answer with maximum two digits after decimal separator
        const correctAnswerMaxTwoDecimal = Number.parseFloat(Math.floor(Number.parseFloat(correctAnswer + "e+2")) + "e-2");
        console.log(correctAnswerMaxTwoDecimal);
        return correctAnswerMaxTwoDecimal;
    }
}
export function getGame(req, res, next) {
    if (req.session.difficulity) {
        if (!req.session.changeQuestion) req.session.changeQuestion = true;
        return res.render("game.ejs", {...req.session.gameEjsObject});
    } else {
        return next("rejection from /game lastMW");
    }
}