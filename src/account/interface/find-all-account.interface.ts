import { Auth } from "src/auth/auth.entity";

export interface FindAllAccountInterface {
    readonly data: Auth[],
    readonly totalData: number,
    readonly totalRow: number,
}