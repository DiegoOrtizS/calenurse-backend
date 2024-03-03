import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn, OneToOne, OneToMany } from "typeorm"
import { UUID } from "typeorm/driver/mongodb/bson.typings"
import { Area } from "./area.entity";
import { User } from "./user.entity";
import { DesiredShift } from "./desired_shift.entity";

@Entity()
export class Nurse {
    @PrimaryGeneratedColumn("uuid")
    id: UUID

    @Column({ nullable: false })
    name: string

    @Column({ nullable: true })
    age: number

    @Column({ nullable: false, unique: true})
    email: string

    @Column({ nullable: false, default: false })
    isBoss: boolean

    @ManyToOne(() => Area, { eager: true, nullable: false })
    @JoinColumn({ name: 'areaId' })
    area: Area;

    @OneToOne(() => User, user => user.nurse)
    user: User;

    @OneToMany(() => DesiredShift, desiredShift => desiredShift.nurse)
    desiredShifts: DesiredShift[];
}