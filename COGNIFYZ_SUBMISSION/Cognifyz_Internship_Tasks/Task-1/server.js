const express = require("express");
const app = express();
const PORT = 3000;

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("index");
});

app.post("/submit", (req, res) => {

    const name = req.body.name;
    const email = req.body.email;
    const age = req.body.age;

    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Age:", age);

    res.render("result", {
    name: name,
    email: email,
    age: age
});
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});