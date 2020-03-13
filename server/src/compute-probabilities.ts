import { join } from "path";
import { existsSync, writeJsonSync, ensureDirSync } from "fs-extra";
import { generateDiceRollTable } from "./dice-table";
import { computeProbabilities } from "./dice-probability";
import { WorkerPool } from "./worker-pool";

if (process.argv.length <= 2 || process.argv.length > 4) {
    console.error(`Unsupported number of arguments ${process.argv.length - 2}`);
} else {
    const dicePoolSize = parseInt(process.argv[2]);
    if (process.argv.length === 3) {
        const table = generateDiceRollTable(dicePoolSize);
        const probabilities = computeProbabilities(table);
        console.log(`D6 Probabilities ${dicePoolSize}`);
        for (const p of probabilities) {
            console.log(`${p.hits}\t${p.probability}\t${p.glitchProbability}`);
        }
    } else if (process.argv.length === 4) {
        const dataDir = process.argv[3];
        ensureDirSync(dataDir);
        const filePath = join(dataDir, `probability-${dicePoolSize}.json`);
        if (existsSync(filePath)) {
            console.log(`'${filePath}' already exists - skipping`);
        } else {
            const workerPool = new WorkerPool(dataDir);
            workerPool.compute(dicePoolSize)
                .then(table => {
                    const probabilities = computeProbabilities(table);
                    writeJsonSync(filePath, probabilities, { encoding: "utf8", spaces: 4 });
                })
                .catch(error => {
                    console.error(`Error computing in worker pool: ${error.message}\n${error.stack}`);
                }).finally(() => {
                    workerPool.cleanup();
                });
        }
    } else {
        throw new Error(`How can ${process.argv.length} be greater than 2, less than 5, and not be 3 or 4?`);
    }
}