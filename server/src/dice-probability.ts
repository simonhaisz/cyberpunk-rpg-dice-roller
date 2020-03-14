import { createReadStream } from "fs";
import { createInterface } from "readline";
import { RollTable } from "./dice-table";

export type RollProbability = {
    hits: number;
    probability: number;
    glitchProbability: number;
};

export type RollSummary = {
    hits: number;
    count: number;
    glitches: number;
};

export async function computeProbabilities(dicePoolSize: number, sectionPaths: string[]): Promise<RollProbability[]> {
    const rollSummaries: RollSummary[] = [];
    for (let i = 0; i < dicePoolSize + 1; i++) {
        rollSummaries[i] = { hits: i, count: 0, glitches: 0 };
    }
    
    const processPromises: Promise<number>[] = [];
    for (const sectionPath of sectionPaths) {
        processPromises.push(processSection(rollSummaries, sectionPath));
    }

    try {
        const rollCount = (await Promise.all(processPromises)).reduce((a,b) => a + b, 0);
        return rollSummaries.map(({hits, count, glitches}) => ({ hits, probability: (count / rollCount), glitchProbability: (glitches / rollCount) }));
    } catch (error) {
        console.error(`Error on processing secionds`);
        throw error;
    }
}

async function processSection(rollSummaries: RollSummary[], sectionPath: string): Promise<number> {
    return new Promise((resolve, reject) => {
        let rollCount = 0;
        const reader = createInterface(createReadStream(sectionPath))
        reader.on("line", line => {
            rollCount++;
            const roll = line.split(",").map(v => parseInt(v));
            let hits = 0;
            let ones = 0;
            for (const die of roll) {
                if (die >= 5) {
                    hits++;
                } else if (die === 1) {
                    ones++;
                }
            }
            const glitch = ones >= Math.ceil(roll.length / 2);
            const summary = rollSummaries[hits];
            if (summary === undefined) {
                throw new Error(`Count not find entry ${hits} in array of ${JSON.stringify(rollSummaries)}`);
            }
            summary.count++;
            if (glitch) {
                summary.glitches++;
            }
        });
        reader.on("close", () => {
            resolve(rollCount);
        });
        reader.on("error", error => {
            reject(error);
        })
    });
}

const oddsOfHit = 2 / 6;
const oddsOfMiss = 4 / 6;
const oddsOfNotOne = 5 / 6;
const oddsOfOne = 1 / 6

export function computeProbabilitiesFromStats(dicePoolSize: number): RollProbability[] {
    const probabilities: RollProbability[] = [];
    const half =  Math.ceil(dicePoolSize / 2);
    for (let hits = 0; hits <= dicePoolSize; hits++) {
        const misses = dicePoolSize - hits;
        const probability = Math.pow(oddsOfHit, hits) * Math.pow(oddsOfMiss, misses);
        let glitchProbability: number;
        if (misses >= half) {
            glitchProbability = 0;
            for (let ones = half; ones <= misses; ones++) {
                glitchProbability += Math.pow(oddsOfNotOne, misses - ones) * Math.pow(oddsOfOne, ones);
            }
        } else {
            glitchProbability = 0;
        }
        probabilities.push({
            hits,
            probability,
            glitchProbability
        });
    }
    return probabilities;
}