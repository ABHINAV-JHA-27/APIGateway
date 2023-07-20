import express from "express";
const registry = require("../data/registry.json");

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
    res.send(registry);
});

export default router;
