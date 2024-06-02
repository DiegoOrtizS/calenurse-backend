import { UUID } from "typeorm/driver/mongodb/bson.typings"

export interface PostShiftExchangeBody {
    shift_a: UUID,
    shift_b: UUID,
}