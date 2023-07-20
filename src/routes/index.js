import express from "express";
import axios from "axios";
import fs from "fs";
import { apiAlreadyExists } from "../utils/helper.js";
import loadBalancer from "../utils/loadBalancer.js";

const registry = JSON.parse(fs.readFileSync("./src/data/registry.json"));

const router = express.Router();

router.all("/:apiName/:path", (req, res) => {
    const service = registry.services[req.params.apiName];
    if (service) {
        const serviceIndex =
            loadBalancer[service.loadBalancerStrategy](service);
        const url = service.instances[serviceIndex].url;
        axios({
            method: req.method,
            headers: req.headers,
            data: req.body,
            url: url + req.params.path,
        })
            .then((response) => {
                res.send(response.data);
            })
            .catch((err) => {
                res.status(err.response.status).send(err.response.data);
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
        res.status(400).send("Service already exists");
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

router.post("/unregister", (req, res) => {
    const registerationInfo = req.body;
    if (apiAlreadyExists(registerationInfo)) {
        const index = registry.services[registerationInfo.apiName].findIndex(
            (service) => service.url === registerationInfo.url
        );
        registry.services[registerationInfo.apiName].splice(index, 1);
        fs.writeFile(
            "./src/data/registry.json",
            JSON.stringify(registry),
            (err) => {
                if (err) {
                    res.status(500).send("Error while unregistering service");
                } else {
                    res.send("Service unregistered successfully");
                }
            }
        );
    } else {
        res.status(400).send("Service doesn't exists");
    }
});

export default router;
