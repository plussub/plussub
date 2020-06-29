
const fs = require('fs').promises;

const toJson = (r) => JSON.parse(r);

(async () => {
    const [package, manifest] = await Promise.all([
        fs.readFile("package.json", "utf-8").then(toJson),
        fs.readFile("manifest.json", "utf-8").then(toJson)
    ]);
    const newManifest = {
        ...manifest,
        version: package.version
    };

    await fs.writeFile("manifest.json", JSON.stringify(newManifest, null, 2));
})();
