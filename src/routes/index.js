import express from "express";
import axios from "axios";
import fs from "fs";

const registry = JSON.parse(fs.readFileSync("./src/data/registry.json"));

const router = express.Router();

router.all("/:apiName/:path", (req, res) => {
    if (registry.services[req.params.apiName]) {
        axios({
            method: req.method,
            headers: req.headers,
            data: req.body,
            url: registry.services[req.params.apiName].url + req.params.path,
        }).then((response) => {
            res.send(response.data);
        });
    } else {
        res.status(404).send("Service not found");
    }
});

router.get("/register", (req, res) => {
    const registerationInfo = req.body;
    registry.services[registerationInfo.apiName] = { ...registerationInfo };
    fs.writeFile(
        "./src/data/registry.json",
        JSON.stringify(registry),
        (err) => {
            if (err) {
                res.status(500).send("Error while registering service");
            } else {
                res.send("Service registered successfully");
            }
        }
    );
});

export default router;
