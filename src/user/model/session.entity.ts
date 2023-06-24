import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, UpdateDateColumn, CreateDateColumn, Relation } from "typeorm";

//ORM Entity
import { User } from "./user.entity";

@Entity()
export class Session {
    @PrimaryGeneratedColumn("identity")
    id: string;

    @Column({ type: "text" })
    cookie: string;

    @Column({ type: "text", nullable: true })
    browser: string;

    @Column({ type: "text", nullable: true })
    os: string;

    @ManyToOne(() => User, (user) => user.session, { cascade: true, onDelete: "CASCADE" })
    user: Relation<User>;

    @Column({ type: "text", nullable: true })
    osVersion: string;

    @Column({ type: "text", nullable: true })
    device: string;

    @Column({ type: "text", nullable: true })
    area: string;

    @UpdateDateColumn({ type: "timestamptz" })
    updated_at: Date;

    @CreateDateColumn({ type: "timestamptz" })
    created_at: Date;
}