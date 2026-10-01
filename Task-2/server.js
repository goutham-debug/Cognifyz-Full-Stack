const express = require("express");

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

let users = [];

app.get("/", (req, res) => {
    res.render("index");
});

app.post("/submit", (req, res) => {

    const { name, email, age } = req.body;

    if (!name || !email || !age) {
        return res.send("All fields are required.");
    }

    if (!email.includes("@")) {
        return res.send("Please enter a valid email.");
    }

    if (age < 18 || age > 100) {
        return res.send("Age must be between 18 and 100.");
    }

    const user = {
        name: name,
        email: email,
        age: age
    };

    users.push(user);

    res.render("result", { user });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});