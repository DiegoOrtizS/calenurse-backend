import { UUID } from "typeorm/driver/mongodb/bson.typings";

export interface GetAreaNursesParams {
    area_id: UUID
    user_id: UUID
}