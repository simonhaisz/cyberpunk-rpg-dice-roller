export function computeFactorial(n: number): number {
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

export function computeChoice(n: number, k: number): number {
    if (k > n) {
        throw new Error(`When choosing k from n, k (${k}) cannot be greater than n (${n})`);
    }
    return computeFactorial(n) / computeFactorial(k);
}