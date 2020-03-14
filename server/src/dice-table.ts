import { join } from "path";
import { promises as fs } from "fs";

export type RollTable = {
    dicePoolSize: number;
    results: number[][];
};

function iterateDie(value: number): number {
    const newValue = value + 1;
    if (newValue <= 6) {
        return newValue;
    }
    return 1;
}

function validateDicePoolSize(dicePoolSize: number) {
    if (dicePoolSize > 12) {
        throw new Error(`${dicePoolSize} is too large for dice roll table generation - max size is 12`);
    }
}

function computeModPoints(dicePoolSize: number): number[]  {
    const modPoints: number[] = [];
    for (let p = 1; p < dicePoolSize; p++) {
        modPoints.push(Math.pow(6, p));
    }
    return modPoints;
}

export function generateDiceRollTable(dicePoolSize: number): RollTable {
    validateDicePoolSize(dicePoolSize);

    const startTime = Date.now();
    
    const generationCount = Math.pow(6, dicePoolSize);

    const modPoints = computeModPoints(dicePoolSize);

    let secondsCounter = 0;

    const results: number[][] = [];
    const resultSet = new Array(dicePoolSize).fill(1);
    let runTimer = startTime;
    for (let i = 0; i < generationCount; i++) {
        if (i > 0) {
            // always iterate the first number
            resultSet[0] = iterateDie(resultSet[0]);
            for (let m = 0; m < modPoints.length; m++) {
                if (i % modPoints[m] === 0) {
                    resultSet[m + 1] = iterateDie(resultSet[m + 1]);
                }
            }
        }
        results.push([...resultSet]);
        
        if ((Date.now() - runTimer) >= 1000) {
            runTimer = Date.now();
            secondsCounter++;
            console.log(`Generating D6 table of size ${dicePoolSize} for ${secondsCounter} seconds...`);
        }
    }
    const endTime = Date.now();
    console.log(`Generating D6 table of size ${dicePoolSize} took ${(endTime - startTime) / 1000} seconds`);
    return {
        dicePoolSize,
        results
    };
}

export type RollTableSection = {
    dicePoolSize: number;
    section: number;
    results: number[][];
}

export async function generateDiceRollTableSection(dicePoolSize: number, section: number, dataDir: string): Promise<string> {
    validateDicePoolSize(dicePoolSize);

    const sectionPath = join(dataDir, `table-section-${dicePoolSize}.${section}.data`);

    const startTime = Date.now();
    
    // each section is 1/6 of the total
    const generationCount = Math.pow(6, dicePoolSize - 1);

    const modPoints = computeModPoints(dicePoolSize);

    let secondsCounter = 0;

    const resultSet = new Array<number>(dicePoolSize).fill(1);
    resultSet[dicePoolSize - 1] = section;
    let runTimer = startTime;
    for (let i = 0; i < generationCount; i++) {
        if (i > 0) {
            // always iterate the first number
            resultSet[0] = iterateDie(resultSet[0]);
            for (let m = 0; m < modPoints.length; m++) {
                if (i % modPoints[m] === 0) {
                    resultSet[m + 1] = iterateDie(resultSet[m + 1]);
                }
            }
        }
        try {
            await fs.appendFile(sectionPath, resultSet.join(",") + "\n", { encoding: "utf8" });
        } catch (error) {
            throw new Error(`Error appending to file '${sectionPath}': ${error.message}\n${error.stack}`);
        }
        
        const currentTime = Date.now();
        if ((currentTime - runTimer) >= 1000) {
            runTimer = currentTime;
            console.log(`Generated ${(i / generationCount * 100).toFixed(1)}% of D6 table section ${section} of size ${dicePoolSize}`);
        }
    }
    const endTime = Date.now();
    console.log(`Generated D6 table section ${section} of size ${dicePoolSize} in ${(endTime - startTime) / 1000} seconds`);
    return sectionPath;
}