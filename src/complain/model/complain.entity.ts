import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, UpdateDateColumn, CreateDateColumn, Relation } from "typeorm";

//Orm Entity
import { User } from "@/user/model/user.entity";

@Entity()
export class Complain {
    @PrimaryGeneratedColumn("identity")
    id: string;

    @Column({ type: "text" })
    title: string;

    @Column({ type: "text" })
    description: string;

    @Column({ type: "text", enum: ["pending", "solve", "rejected"], default: "pending" })
    status: string;

    @ManyToOne(() => User)
    complainBy: Relation<User>;

    @Column({ type: "boolean", default: false })
    anonymous: boolean;

    @UpdateDateColumn({ type: "timestamptz" })
    updated_at: Date;

    @CreateDateColumn({ type: "timestamptz" })
    created_at: Date;
}