import express from "express";

const app = express();
const port = 4000;
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "Server running 🚀" });
});

app.listen(port, () => console.log(`Server listening on port ${port}`));
// this comment is here to test git changes 1
