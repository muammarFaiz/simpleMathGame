import express from "express";
import session from "express-session";
// TODO: create login session with express-session

const app = express();

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


app.get("/", (req, res, next) => {
    if (req.session.views) {
        req.session.views++;
    } else {
        req.session.views = 1;
    }
    console.log(req.session);
    res.render("game.ejs");
});
app.post("/login", (req, res, next) => {
    
});
app.post("/register", (req, res, next) => {
    
});

app.listen(3000, () => {
    console.log("listening on 3000");
});