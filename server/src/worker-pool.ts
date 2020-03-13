import { Worker } from "worker_threads";
import { readJsonSync } from "fs-extra";
import { RollTable, RollTableSection, assembleDiceRollTableSections } from "./dice-table";
import { Response } from "./message";

export class WorkerPool {

    private readonly dataDir: string;
    private readonly workers: Worker[] = [];

    constructor(dataDir: string) {
        this.dataDir = dataDir;
    }

    async compute(dicePoolSize: number): Promise<RollTable> {
        const sectionPromises: Promise<RollTableSection>[] = [];
        for (let section = 1; section <= 6; section++) {
            sectionPromises.push(this.startWorker(dicePoolSize, section));
        }
        const sections = await Promise.all(sectionPromises);
        return assembleDiceRollTableSections(dicePoolSize, sections);
    }

    private async startWorker(dicePoolSize: number, section: number): Promise<RollTableSection> {
        return new Promise((resolve, reject) => {
            const worker = new Worker("./out/probability-worker.js", { workerData: { dataDir: this.dataDir } });
            this.workers.push(worker);
            worker.on("message", (response: Response) => {
                resolve(readJsonSync(response.sectionPath, { encoding: "utf8" }));
            });
            worker.on("error", error => {
                reject(error);
            });
            worker.on("exit", code => {
                if (code !== 0) {
                    reject(new Error(`worker exited with code ${code}`));
                }
            })

            worker.postMessage({ dicePoolSize, section });
        });
    }

    cleanup() {
        this.workers.forEach(w => w.terminate());
    }
}