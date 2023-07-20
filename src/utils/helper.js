import fs from "fs";
const registry = JSON.parse(fs.readFileSync("./src/data/registry.json"));

export const apiAlreadyExists = (registerationInfo) => {
    let check = false;
    if (!registry.services[registerationInfo.apiName]) {
        return check;
    }
    registry.services[registerationInfo.apiName].instances.forEach(
        (service) => {
            if (service.url === registerationInfo.url) {
                check = true;
                return check;
            }
        }
    );
    return check;
};
