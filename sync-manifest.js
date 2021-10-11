import { promises } from "fs";
const toJson = (r) => JSON.parse(r);

(async () => {
    const [packagez, manifestChrome, manifestFirefox] = await Promise.all([
        promises.readFile("package.json", "utf-8").then(toJson),
        promises.readFile("src/manifest-chrome.json", "utf-8").then(toJson),
        promises.readFile("src/manifest-firefox.json", "utf-8").then(toJson)
    ]);
    await promises.writeFile("src/manifest-chrome.json", JSON.stringify({
        ...manifestChrome,
        version: packagez.version
    }, null, 2));
    await promises.writeFile("src/manifest-firefox.json", JSON.stringify({
        ...manifestFirefox,
        version: packagez.version
    }, null, 2));
})();
