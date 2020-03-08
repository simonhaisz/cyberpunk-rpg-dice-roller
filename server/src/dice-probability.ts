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

const defaultSummary: RollSummary = { hits: 0, count: 0, glitches: 0 };

export function computeProbabilities(rollTable: RollTable): RollProbability[] {
    const rollSummaries: RollSummary[] = [];
    for (let i = 0; i < rollTable.dicePoolSize + 1; i++) {
        rollSummaries[i] = { hits: i, count: 0, glitches: 0 };
    }
    for (const roll of rollTable.results) {
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
    }
    const rollCount = rollTable.results.length;
    return rollSummaries.map(({hits, count, glitches}) => ({ hits, probability: (count / rollCount), glitchProbability: (glitches / rollCount) }));
}