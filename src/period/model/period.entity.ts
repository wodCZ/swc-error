import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, UpdateDateColumn, CreateDateColumn, Relation } from "typeorm";

//Orm Entity
import { User } from "@/user/model/user.entity";
import { Shift } from "@/shift/model/shift.entity";

@Entity()
export class Period {
    @PrimaryGeneratedColumn("identity")
    id: string;

    @Column({ type: "text" })
    name: string;

    @Column({ type: "text" })
    start: string;

    @Column({ type: "text" })
    end: string;

    @Column({ type: "boolean" })
    is_break: boolean;

    @ManyToOne(() => Shift)
    shift: Relation<Shift>;

    @ManyToOne(() => User)
    createdBy: Relation<User>;

    @UpdateDateColumn({ type: "timestamptz" })
    updated_at: Date;

    @CreateDateColumn({ type: "timestamptz" })
    created_at: Date;
}