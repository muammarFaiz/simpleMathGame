import express from "express";

const app = express();


app.use(express.urlencoded({extended: false}));
app.use(express.static("public"));

app.get("/", (req, res, next) => {
    res.sendFile("game.html", {root: "."});
});

app.listen(3000, () => {
    console.log("listening on 3000");
});