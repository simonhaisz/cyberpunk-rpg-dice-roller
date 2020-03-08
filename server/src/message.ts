import { RollTableSection } from "./dice-table";

export type Request = {
    dicePoolSize: number;
    section: number;
};

export type Response = {
    section: RollTableSection;
};