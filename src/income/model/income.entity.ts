import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, Relation } from "typeorm";

//Entities
import { User } from "@/user/model/user.entity";
import { IncomeHead } from "./income-head.entity";

@Entity()
export class Income {
    @PrimaryGeneratedColumn("identity")
    id: string;

    @ManyToOne(() => IncomeHead)
    head: Relation<IncomeHead>;

    @Column({ type: "text" })
    name: string;

    @Column({ type: "text" })
    amount: string;

    @Column({ type: "text", nullable: true })
    invoice: string;

    @Column({ type: "text", nullable: true })
    date: string;

    @Column({ type: "text", nullable: true })
    file: string;

    @Column({ type: "text", nullable: true })
    description: string;

    @ManyToOne(() => User)
    createdBy: Relation<User>;

    @UpdateDateColumn({ type: "timestamptz" })
    updated_at: Date;

    @CreateDateColumn({ type: "timestamptz" })
    created_at: Date;
}