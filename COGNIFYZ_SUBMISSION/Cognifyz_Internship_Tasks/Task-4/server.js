const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;


app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.render("index");
});

app.post("/register", (req, res) => 
{
    const { name, email, password, confirmPassword, age } = req.body;
    if (password !== confirmPassword) {
    return res.send("Passwords do not match!");
    }
    if (!name || !email || !password || !confirmPassword || !age) {
    return res.send("All fields are required!");
    }
    if (password.length < 8) {
    return res.send("Password must be at least 8 characters long!");
    }
    if (!/\d/.test(password)) {
    return res.send("Password must contain at least one number!");
    }
    if (!/[A-Z]/.test(password)) {
    return res.send("Password must contain at least one uppercase letter!");
    }
    if (!/[!@#$%^&*]/.test(password)) {
    return res.send("Password must contain at least one special character!");
    }
    if (!email.includes("@")) {
    return res.send("Please enter a valid email!");
    }
    if (age < 18) {
    return res.send("You must be at least 18 years old!");
    }
     res.render("success", { name, email, password, confirmPassword, age });

} );


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});