import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm"
import { Nurse } from "./nurse.entity"
import { UUID } from "typeorm/driver/mongodb/bson.typings"
import { Shift } from "../types/shift.enum"

@Entity()
export class GeneratedShift {
    @PrimaryGeneratedColumn("uuid")
    id: UUID

    @ManyToOne(() => Nurse, { nullable: false, onDelete: "CASCADE" })
    @JoinColumn({ name: "nurseId" })    
    nurse: Nurse

    @Column({ nullable: false })
    date: Date

    @Column({
        type: "enum",
        enum: Shift,
        nullable: false
    })
    shift: Shift
}