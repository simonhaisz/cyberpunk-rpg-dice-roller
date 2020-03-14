import { Worker } from "worker_threads";
import { Response } from "./message";

export class WorkerPool {

    private readonly dataDir: string;
    private readonly workers: Worker[] = [];

    constructor(dataDir: string) {
        this.dataDir = dataDir;
    }

    async compute(dicePoolSize: number): Promise<string[]> {
        const sectionPromises: Promise<string>[] = [];
        for (let section = 1; section <= 6; section++) {
            sectionPromises.push(this.startWorker(dicePoolSize, section));
        }
        return Promise.all(sectionPromises);
    }

    private async startWorker(dicePoolSize: number, section: number): Promise<string> {
        return new Promise((resolve, reject) => {
            const worker = new Worker("./out/probability-worker.js", { workerData: { dataDir: this.dataDir } });
            this.workers.push(worker);
            worker.on("message", (response: Response) => {
                resolve(response.sectionPath);
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