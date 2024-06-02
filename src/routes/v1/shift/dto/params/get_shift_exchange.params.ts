import { UUID } from "typeorm/driver/mongodb/bson.typings"

export interface GetShiftExchangeParams {
    nurse_id: UUID,
}