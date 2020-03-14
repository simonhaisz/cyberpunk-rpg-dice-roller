import { program } from "commander";
import { ensureDirSync, writeJsonSync, existsSync } from "fs-extra";
import { join } from "path";
import { computeProbabilitiesFromStats } from "./dice-probability";

program
    .requiredOption("-d, --dice-pool-size <dice>", "Dice pool size to compute", parseInt)
    .option("-k, --keep", "Keep any existing results probabilities", false);

program.parse(process.argv);

const dicePoolSize = program.dicePoolSize;
const dataDir = "data";
ensureDirSync(dataDir);
const filePath = join(dataDir, `probability-stats-${dicePoolSize}.json`);
if (existsSync(filePath)  && program.keep) {
    console.log(`'${filePath}' already exists - skipping`);
} else {
    const probabilities = computeProbabilitiesFromStats(dicePoolSize);
    writeJsonSync(filePath, probabilities, { encoding: "utf8", spaces: 4 });
}