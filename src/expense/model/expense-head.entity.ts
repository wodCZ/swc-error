import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, Relation } from "typeorm";

//Entities
import { User } from "@/user/model/user.entity";

@Entity()
export class ExpenseHead {
    @PrimaryGeneratedColumn("identity")
    id: string;

    @Column({ type: "text" })
    title: string;

    @Column({ type: "text", nullable: true })
    description: string;

    @ManyToOne(() => User)
    createdBy: Relation<User>;

    @UpdateDateColumn({ type: "timestamptz" })
    updated_at: Date;

    @CreateDateColumn({ type: "timestamptz" })
    created_at: Date;
}