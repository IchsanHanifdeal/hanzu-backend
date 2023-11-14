import { Income } from "../income.entity";

export interface FindAllIncomeInterface {
    readonly data: Income[],
    readonly totalData: number,
    readonly totalRow: number,
}