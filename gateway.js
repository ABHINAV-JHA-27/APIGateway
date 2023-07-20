import express from "express";
import helmet from "helmet";
import dotenv from "dotenv";
import routes from "./src/routes/index.js";
import Auth from "./src/middlewares/Auth.js";
import ejs from "ejs";
import path from "path";

dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.get("/dashboard", (req, res) => {
    res.render("index");
});
app.use(Auth);
app.use("/api/", routes);

app.listen(PORT, () => {
    console.log(`Gateway started on port ${PORT} !!`);
});
