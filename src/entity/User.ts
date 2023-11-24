import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BaseEntity } from "typeorm";
import { NurseSchedule } from "./NurseSchedule"; // Ajusta la ruta según tu estructura

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @OneToMany(() => NurseSchedule, nurseSchedule => nurseSchedule.user)
    schedules!: NurseSchedule[];

    @Column({ type: "varchar", length: 100 })
    name: string;

    @Column({ type: "varchar", length: 20 })
    number: string;

    @Column({ type: "varchar", length: 100 })
    email: string;

    @Column({ type: "varchar", length: 100 })
    password: string;

    @Column({ type: "varchar", length: 50 })
    type: string;

    @Column({ type: "varchar", length: 50 })
    area: string;

    constructor(name: string, number: string, email: string, password: string, type: string, area: string) {
        super();
        this.name = name;
        this.number = number;
        this.email = email;
        this.password = password;
        this.type = type;
        this.area = area;
    }
}
