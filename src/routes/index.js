import express from "express";
import axios from "axios";
import fs from "fs";
import { apiAlreadyExists } from "../utils/helper.js";

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

router.post("/register", (req, res) => {
    const registerationInfo = req.body;
    registerationInfo.url =
        registerationInfo.protocol +
        "://" +
        registerationInfo.host +
        ":" +
        registerationInfo.port +
        "/";

    if (apiAlreadyExists(registerationInfo)) {
        res.status(400).send("API already exists");
    } else {
        if (!registry.services[registerationInfo.apiName]) {
            registry.services[registerationInfo.apiName] = [];
        }

        registry.services[registerationInfo.apiName].push({
            ...registerationInfo,
        });

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
    }
});

export default router;
