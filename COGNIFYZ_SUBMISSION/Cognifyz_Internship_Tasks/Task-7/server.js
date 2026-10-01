const express = require("express");
const session = require("express-session");
const axios = require("axios");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();
const PORT = 3002;

app.use(session({
    secret: "cognifyz-task-7-secret",
    resave: false,
    saveUninitialized: false
}));

app.use(express.json());

const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    message: {
        error: "Too many requests. Please try again later."
    }
});

app.use("/api", apiLimiter);

app.get("/auth/github", (req, res) => {

    const githubAuthUrl =
        "https://github.com/login/oauth/authorize" +
        "?client_id=" + process.env.GITHUB_CLIENT_ID +
        "&scope=read:user";

    res.redirect(githubAuthUrl);
});

app.get("/auth/github/callback", async (req, res) => {
    const code = req.query.code;

    if (!code) {
        return res.status(400).send("Authorization code missing.");
    }

    try {
        const tokenResponse = await axios.post(
            "https://github.com/login/oauth/access_token",
            {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code: code
            },
            {
                headers: {
                    Accept: "application/json"
                }
            }
        );

        const accessToken = tokenResponse.data.access_token;

        if (!accessToken) {
            return res.status(401).send("Failed to obtain access token.");
        }

        req.session.accessToken = accessToken;

        res.redirect("/api/github-user");

    } catch (error) {
        console.error("OAuth error:", error.response?.data || error.message);
        res.status(500).send("GitHub authentication failed.");
    }
});

app.get("/api/github-user", async (req, res) => {

    if (!req.session.accessToken) {
        return res.status(401).json({
            error: "Please login with GitHub first."
        });
    }

    try {
        const response = await axios.get(
            "https://api.github.com/user",
            {
                headers: {
                    Authorization: `Bearer ${req.session.accessToken}`,
                    Accept: "application/vnd.github+json"
                }
            }
        );

        res.json({
            name: response.data.name,
            username: response.data.login,
            profile: response.data.html_url,
            publicRepositories: response.data.public_repos
        });

    } catch (error) {
        console.error(
            "GitHub API error:",
            error.response?.data || error.message
        );

        res.status(500).json({
            error: "Failed to fetch GitHub user information."
        });
    }
});



app.get("/", (req, res) => {
    res.send(`
        <h1>Cognifyz Task 7</h1>
        <p>OAuth + External API + Rate Limiting</p>
        <a href="/auth/github">Login with GitHub</a>
    `);
});

app.listen(PORT, () => {
    console.log(`Task 7 server running at http://127.0.0.1:${PORT}`);
});