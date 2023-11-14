import { Event } from "../event.entity";

export interface FindAllEventInterface {
    readonly data: Event[],
    readonly totalData: number,
    readonly totalRow: number,
}