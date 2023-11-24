import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity()
export class NurseRequirements extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "integer" })
    morningShift: number;

    @Column({ type: "integer" })
    afternoonShift: number;

    @Column({ type: "integer" })
    eveningShift: number;

    constructor(morningShift: number, afternoonShift: number, eveningShift: number) {
        super();
        this.morningShift = morningShift;
        this.afternoonShift = afternoonShift;
        this.eveningShift = eveningShift;
    }
}
