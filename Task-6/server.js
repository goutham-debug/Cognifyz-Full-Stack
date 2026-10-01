
const express = require("express");
const session = require("express-session");
const path = require("path");
const bcrypt = require("bcrypt");

const db = require("./database");

const app = express();
app.use(session({
    secret: "task6-secret-key",
    resave: false,
    saveUninitialized: false
}));
const PORT = 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.send("Task 6 server is running!");
});

app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.send("All fields are required!");
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        db.run(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
            [name, email, hashedPassword],
            function (err) {
                if (err) {
                    console.error(err.message);
                    return res.send("Registration failed!");
                }

                res.send("Registration successful!");
            }
        );

    } catch (error) {
        console.error(error);
        res.send("Something went wrong!");
    }
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.send("Email and password are required!");
    }

    db.get(
        "SELECT * FROM users WHERE email = ?",
        [email],
        async (err, user) => {

            if (err) {
                console.error(err.message);
                return res.send("Login failed!");
            }

            if (!user) {
                return res.send("Invalid email or password!");
            }

            const passwordMatch = await bcrypt.compare(
                password,
                user.password
            );

            if (!passwordMatch) {
                return res.send("Invalid email or password!");
            }

            req.session.user = {
    id: user.id,
    email: user.email
};

res.send("Login successful");
        }
    );
});

app.get("/dashboard", (req, res) => {

    if (!req.session.user) {
        return res.status(401).send("Unauthorized. Please login first.");
    }

    res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

app.listen(PORT, () => {
    console.log(`Task 6 server running at http://localhost:${PORT}`);
});