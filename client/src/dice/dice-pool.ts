export type RollResult = {
    hitCount: number;
    glitch: boolean;
}

export function rollDice(poolSize: number): RollResult {
    let hitCount = 0;
    let oneCount = 0;
    for (let i = 0; i < poolSize; i++) {
        const result = rollDie();
        if (result >= 5) {
            hitCount++;
        } else if (result === 1) {
            oneCount++;
        }
    }
    const glitch = oneCount >= Math.ceil(poolSize / 2);
    return {
        hitCount,
        glitch
    };
}

function rollDie(): number {
    return Math.floor(Math.random() * 6) + 1;
}