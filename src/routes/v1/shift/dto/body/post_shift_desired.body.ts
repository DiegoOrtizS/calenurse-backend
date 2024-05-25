import { Shift } from "../../../../../types/shift.enum";
import { UUID } from "typeorm/driver/mongodb/bson.typings"

export interface PostShiftDesiredBody {
    shift: Shift
    date: Date
    nurse_id: UUID
}