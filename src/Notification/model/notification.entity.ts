import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable, UpdateDateColumn, CreateDateColumn, Relation } from "typeorm";

//Orm Entity
import { User } from "@/user/model/user.entity";

@Entity()
export class Receivers {
    @PrimaryGeneratedColumn("identity")
    id: string;

    @Column({ type: "text", nullable: true })
    to: string;
}

@Entity()
export class Notification {
    @PrimaryGeneratedColumn("identity")
    id: string;

    @Column({ type: "text", nullable: true })
    title: string;

    @Column({ type: "text", nullable: true })
    details: string;

    @Column({ type: "text", nullable: true })
    image: string;

    @Column({ type: "boolean", default: false })
    read: boolean;

    @Column({ type: "text", nullable: true, enum: ["individual", "role", "class"] })
    type: string;

    @Column({ type: "json", nullable: true })
    path: { id: string, type: string };

    @ManyToMany(() => Receivers, { onDelete: "CASCADE", cascade: true })
    @JoinTable()
    receivers: Relation<Receivers[]>;

    @ManyToOne(() => User)
    senderId: Relation<User>;

    @UpdateDateColumn({ type: "timestamptz" })
    updated_at: Date;

    @CreateDateColumn({ type: "timestamptz" })
    created_at: Date;
}