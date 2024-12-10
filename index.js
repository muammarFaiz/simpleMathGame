import express from "express";
import session from "express-session";
import pg from "pg";
import "dotenv/config";
import { validateUserInput, comparePassWithDatabase, goIfLoggedin, changeQuestionIfTrue } from "./middlewares.js";
import { getGame, getLogout, getRoot, postDifficulity, postLogin, postRegister, postValidateAnswer } from "./endingMiddlewares.js";

const app = express();
const pool = new pg.Pool({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "1234",
    database: "world"
});
pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

app.use(express.urlencoded({extended: false}));
app.use(express.static("public"));
app.use(session({
    secret: "faiz",
    saveUninitialized: false,
    resave: false,
    name: "faiz-cookie",
    cookie: {
        maxAge: 1000 * 60 * 60
    }
}));

app.use((req, res, next) => {
    console.log(req.body);
    console.log(req.session);
    next();
})

app.get("/", getRoot);
app.post("/login", validateUserInput, comparePassWithDatabase(pool), postLogin);
app.post("/register", validateUserInput, postRegister(pool));
app.get("/logout", getLogout);
app.post("/difficulity", goIfLoggedin, postDifficulity);
app.post("/validateAnswer", goIfLoggedin, postValidateAnswer);
app.get("/game", goIfLoggedin, changeQuestionIfTrue, getGame);

app.use((err, req, res, next) => {
    console.error(err.stack);
    if (typeof err == "string") {
        switch (err) {
            case "rfv: username/password empty":
                req.session.userStatus = "username and password required";
                break;
            case "rfv: input invalid":
                req.session.userStatus = "invalid username or password";
                break;
            case "rejection from comparePassWithDatabase":
                req.session.userStatus = "invalid username or password";
                break;
            case "rejection from goIfLoggedin":
                break;
            case "rejection from /game lastMW":
                break;
            case "register fail, database error":
                req.session.userStatus = "register fail, database error";
                break;
            default:
                break;
        }
        if (err.slice(0, 4) == "game") {
            return res.redirect("/game");
        } else {
            return res.redirect("/");
        }
    }
    return res.status(500).send('Something is broken!');
});

app.listen(3000, () => {
    console.log("listening on 3000");
});