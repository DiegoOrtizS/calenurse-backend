import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, Index } from "typeorm"
import { Nurse } from "./nurse.entity"
import { UUID } from "typeorm/driver/mongodb/bson.typings"

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: UUID

    @OneToOne(() => Nurse, { eager: true, nullable: false })
    @JoinColumn({ name: 'nurseId' })
    nurse: Nurse

    @Column({ nullable: false, unique: true })
    @Index("idx_username_hash", { unique: true })
    username: string

    @Column({ nullable: false })
    password: string
}