export type RollTable = {
    dicePoolSize: number;
    results: number[][];
};

export function generateDiceRollTable(dicePoolSize: number): RollTable {
    if (dicePoolSize > 12) {
        throw new Error(`${dicePoolSize} is too large for dice roll table generation - max size is 12`);
    }

    const startTime = Date.now();
    
    const generationCount = Math.pow(6, dicePoolSize);

    const modPoints: number[] = [];
    for (let p = 1; p < dicePoolSize; p++) {
        modPoints.push(Math.pow(6, p));
    }

    const iterateDie = (value: number): number => {
        const newValue = value + 1;
        if (newValue <= 6) {
            return newValue;
        }
        return 1;
    };

    let secondsCounter = 0;

    const results: number[][] = [];
    const resultSet = new Array(dicePoolSize).fill(1);
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
        if ((Date.now() - startTime - secondsCounter * 1000) >= 1000) {
            secondsCounter++;
            console.log(`Generating for ${secondsCounter} seconds`);
        }
    }
    const endTime = Date.now();
    console.log(`Generating D6 table of size ${dicePoolSize} took ${(endTime - startTime) / 1000} seconds`);
    return {
        dicePoolSize,
        results
    };
}