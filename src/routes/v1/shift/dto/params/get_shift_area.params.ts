import { UUID } from "typeorm/driver/mongodb/bson.typings";

export interface GetShiftAreaParams {
    boss_id: UUID
    date: string
}