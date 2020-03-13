import { parentPort, workerData } from "worker_threads";
import { join } from "path";
import { writeJsonSync } from "fs-extra";
import { Request } from "./message";
import { generateDiceRollTableSection } from "./dice-table";

if (parentPort === null) {
    throw new Error(`Probability worker thread has no parentPort`);
}

parentPort.on("message", (request: Request) => {
    if (parentPort === null) {
        throw new Error(`Probability worker thread has no parentPort`);
    }
    const { dicePoolSize, section } = request;
    const tableSection = generateDiceRollTableSection(dicePoolSize, section);
    const sectionPath = join(workerData.dataDir, `table-section-${tableSection.dicePoolSize}.${tableSection.section}.json`);
    writeJsonSync(sectionPath, tableSection, { encoding: "utf8", spaces: 4});
    parentPort.postMessage({ sectionPath });
});