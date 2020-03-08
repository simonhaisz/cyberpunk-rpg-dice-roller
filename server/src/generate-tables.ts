import { generateDiceRollTable } from "./dice-table";

const dicePoolSize = parseInt(process.argv[2]);

const table = generateDiceRollTable(dicePoolSize);
console.log(`D6 Table ${dicePoolSize}`);
for (const result of table.results) {
    console.log(result.join("\t"));
}