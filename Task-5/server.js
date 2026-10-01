const express = require("express");

const app = express();
const PORT = 3000;
let users = [
    {
        id: 1,
        name: "Goutham",
        email: "goutham@gmail.com"
    }
];

app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.send("Task 5 API is running!");
});
app.get("/api/users", (req, res) => {
    res.json(users);
});
app.get("/api/users", (req, res) => {
    res.json(users);
});

app.post("/api/users", (req, res) => {
    const newUser = {
        id: users.length + 1,
        name: req.body.name,
        email: req.body.email
    };

    users.push(newUser);

    res.status(201).json(newUser);
});
app.put("/api/users/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const user = users.find(user => user.id === id);

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    user.name = req.body.name;
    user.email = req.body.email;

    res.json(user);
});
app.delete("/api/users/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const userIndex = users.findIndex(user => user.id === id);

    if (userIndex === -1) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    const deletedUser = users.splice(userIndex, 1);

    res.json({
        message: "User deleted successfully",
        user: deletedUser[0]
    });
});


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});