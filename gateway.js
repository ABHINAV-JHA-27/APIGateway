import express from "express";
import helmet from "helmet";
import dotenv from "dotenv";

dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();
app.use(helmet());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(PORT, () => {
    console.log(`Gateway started on port ${PORT} !!`);
});
