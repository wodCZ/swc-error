import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, UpdateDateColumn, CreateDateColumn, Relation } from "typeorm";

//Orm Entity
import { User } from "@/user/model/user.entity";

@Entity()
export class Teacher {
    @PrimaryGeneratedColumn("identity")
    id: string;

    @Column({ type: "text" })
    name: string;

    @Column({ type: "text", nullable: true })
    image: string;

    @Column({ type: "text" })
    phone: string;

    @Column({ type: "text" })
    email: string;

    @Column({ type: "text" })
    dob: string;

    @Column({ type: "text" })
    gender: string;

    @Column({ type: "text" })
    nid: string;

    @Column({ type: "text", nullable: true })
    education: string;

    @Column({ type: "text", nullable: true })
    emergencyPhone: string;

    @Column({ type: "text" })
    appointment: string;

    @Column({ type: "text" })
    salary: string;

    @Column({ type: "text" })
    address: string;

    @Column({ type: "text", nullable: true })
    document: string;

    @ManyToOne(() => User)
    createdBy: Relation<User>;

    @ManyToOne(() => User)
    accountId: Relation<User>;

    @UpdateDateColumn({ type: "timestamptz" })
    updated_at: Date;

    @CreateDateColumn({ type: "timestamptz" })
    created_at: Date;
}