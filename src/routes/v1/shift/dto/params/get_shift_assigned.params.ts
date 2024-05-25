import { UUID } from "typeorm/driver/mongodb/bson.typings";

export interface GetShiftAssignedParams {
    nurse_id: UUID
    date: string
}