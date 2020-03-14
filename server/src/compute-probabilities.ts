import { join } from "path";
import { existsSync, writeJsonSync, ensureDirSync } from "fs-extra";
import { computeProbabilities } from "./dice-probability";
import { WorkerPool } from "./worker-pool";

if (process.argv.length <= 2 || process.argv.length > 3) {
    console.error(`Unsupported number of arguments ${process.argv.length - 2}`);
} else {
    const dicePoolSize = parseInt(process.argv[2]);
    const dataDir = "data";
    ensureDirSync(dataDir);
    const filePath = join(dataDir, `probability-${dicePoolSize}.json`);
    if (existsSync(filePath)) {
        console.log(`'${filePath}' already exists - skipping`);
    } else {
        const workerPool = new WorkerPool(dataDir);
        workerPool.compute(dicePoolSize)
            .then(sectionPaths => {
                computeProbabilities(dicePoolSize, sectionPaths)
                    .then(probabilities => {
                        writeJsonSync(filePath, probabilities, { encoding: "utf8", spaces: 4 });
                    });
            })
            .catch(error => {
                console.error(`Error computing in worker pool: ${error.message}\n${error.stack}`);
            }).finally(() => {
                workerPool.cleanup();
            });
    }
}