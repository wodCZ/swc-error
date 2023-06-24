import { Entity, Relation, PrimaryGeneratedColumn, Column, OneToMany, UpdateDateColumn, CreateDateColumn } from "typeorm";

//Orm Entity
import { Session } from "./session.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn("identity")
    id: string;

    @Column({ type: "text", nullable: true })
    phone: string;

    @Column({ type: "text", nullable: true })
    name: string;

    @OneToMany(() => Session, (session) => session.user)
    session: Relation<Session[]>;

    @Column({ type: "text", nullable: true })
    studentId: string;

    @Column({ type: "text", nullable: true, select: false })
    password: string;

    @Column({ type: "text", enum: ["principal", "accountant", "teacher", "parents", "student"], default: "student" })
    role: string;

    @Column({ type: "text", nullable: true, select: false })
    otp: string;

    @Column({ type: "text", nullable: true })
    image: string;

    @Column({ type: "boolean", default: false })
    is_verify: boolean;

    @UpdateDateColumn({ type: "timestamptz" })
    updated_at: Date;

    @CreateDateColumn({ type: "timestamptz" })
    created_at: Date;
}