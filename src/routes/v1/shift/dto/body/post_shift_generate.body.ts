import { UUID } from "typeorm/driver/mongodb/bson.typings"

export interface PostShiftGenerateBody {
    nurse_id: UUID
    morning: number
    afternoon: number
    night: number

}