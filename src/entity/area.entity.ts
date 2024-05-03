import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm"
import { UUID } from "typeorm/driver/mongodb/bson.typings"
import { Nurse } from "./nurse.entity";

@Entity()
export class Area {
    @PrimaryGeneratedColumn("uuid")
    id: UUID

    @Column()
    name: string

    @OneToMany(() => Nurse, nurse => nurse.area)
    nurses: Nurse[];
}
