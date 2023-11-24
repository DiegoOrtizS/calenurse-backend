import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne } from "typeorm";
import { User } from "./Usuario"; // Asegúrate de ajustar la ruta de importación según tu estructura de proyecto

@Entity()
export class NurseSchedule extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, user => user.schedules)
    user: User;

    @Column({ type: "varchar", length: 10 })
    day: string;

    @Column()
    shift: number; // 0 para libre, 1 para mañana, 2 para tarde, 3 para noche

    constructor(user: User, day: string, shift: number) {
        super();
        this.user = user;
        this.day = day;
        this.shift = shift;
    }
}
