import { parentPort } from "worker_threads";
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
    parentPort.postMessage({ section: tableSection });
});