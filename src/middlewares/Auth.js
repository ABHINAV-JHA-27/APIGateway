import fs from "fs";
const registry = JSON.parse(fs.readFileSync("./src/data/registry.json"));

const Auth = (req, res, next) => {
    const authString = Buffer.from(
        req.headers.authorization,
        "base64"
    ).toString("utf-8");
    const [username, password] = authString.split(":");
    const user = registry.auth.user[username];
    if (user) {
        if (user.username == username && user.password === password) {
            next();
        } else {
            res.status(401).send("Invalid password");
        }
    }
};

export default Auth;
