const express = require("express");
const morgan = require("morgan");
const cron = require("node-cron");
const NodeCache = require("node-cache");

const app = express();
const PORT = 3003;

app.use(express.json());
app.use(morgan("dev"));

const cache = new NodeCache({ stdTTL: 60 });

let tasks = [
    { id: 1, title: "Learn Node.js", status: "Pending" },
    { id: 2, title: "Complete Task 8", status: "In Progress" }
];

app.get("/", (req, res) => {
    res.send("Task 8 server is running!");
});

app.get("/api/tasks", (req, res, next) => {
    try {
        const cachedTasks = cache.get("tasks");

        if (cachedTasks !== undefined) {
            console.log("Serving tasks from cache");
            return res.json(cachedTasks);
        }

        console.log("Fetching tasks from source");

        cache.set("tasks", tasks);

        res.json(tasks);
    } catch (error) {
        next(error);
    }
});

cron.schedule("* * * * *", () => {
    console.log(
        "Background job executed at:",
        new Date().toLocaleString()
    );

    console.log("Background task processing completed.");
});

app.get("/api/error-test", (req, res, next) => {
    next(new Error("This is a test error."));
});

app.use((req, res, next) => {
    const error = new Error("Route not found");
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    console.error("Error:", err.message);

    const statusCode = err.status || 500;

    res.status(statusCode).json({
        error: statusCode === 500
            ? "Internal server error"
            : err.message
    });
});

app.listen(PORT, () => {
    console.log(`Task 8 server running at http://localhost:${PORT}`);
});