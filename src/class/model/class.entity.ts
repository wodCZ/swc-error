import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable, UpdateDateColumn, CreateDateColumn, Relation } from "typeorm";

//Orm Entity
import { User } from "@/user/model/user.entity";
import { Section } from "@/section/model/section.entity";
import { Group } from "@/group/model/group.entity";
import { Shift } from "@/shift/model/shift.entity";

@Entity()
export class Class {
    @PrimaryGeneratedColumn("identity")
    id: string;

    @Column({ type: "text" })
    name: string;

    @ManyToMany(() => Section)
    @JoinTable()
    section: Relation<Section[]>;

    @ManyToMany(() => Group)
    @JoinTable()
    group: Relation<Group[]>;

    @ManyToMany(() => Shift)
    @JoinTable()
    shift: Relation<Shift[]>;

    @ManyToOne(() => User)
    createdBy: Relation<User>;

    @UpdateDateColumn({ type: "timestamptz" })
    updated_at: Date;

    @CreateDateColumn({ type: "timestamptz" })
    created_at: Date;
}