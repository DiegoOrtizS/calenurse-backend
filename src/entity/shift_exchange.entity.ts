import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm"
import { UUID } from "typeorm/driver/mongodb/bson.typings"
import { GeneratedShift } from "./generated_shift.entity"

@Entity()
export class ShiftExchange {
    @PrimaryGeneratedColumn("uuid")
    id: UUID

    @ManyToOne(() => GeneratedShift, { nullable: false, onDelete: "CASCADE" })
    @JoinColumn({ name: "shiftA" })    
    shiftA: GeneratedShift

    @ManyToOne(() => GeneratedShift, { nullable: false, onDelete: "CASCADE" })
    @JoinColumn({ name: "shiftB" })    
    shiftB: GeneratedShift

    @Column({ nullable: false })
    state: boolean
}