import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, UpdateDateColumn, CreateDateColumn, JoinTable, Relation } from "typeorm";

//Orm Entity
import { User } from "@/user/model/user.entity";
import { Class } from "@/class/model/class.entity";
import { Subject } from "@/subject/model/subject.entity";
import { Shift } from "@/shift/model/shift.entity";
import { Section } from "@/section/model/section.entity";
import { Group } from "@/group/model/group.entity";

@Entity()
export class Student {
    @PrimaryGeneratedColumn("identity")
    id: string;

    @ManyToOne(() => Class)
    class: Relation<Class>;

    @ManyToOne(() => Shift)
    shift: Relation<Shift>;

    @ManyToOne(() => Section)
    section: Relation<Section>;

    @ManyToOne(() => Group)
    group: Relation<Group>;

    @ManyToMany(() => Subject)
    @JoinTable()
    subject: Relation<Subject[]>;

    @Column({ type: "text" })
    studentId: string;

    @Column({ type: "text" })
    name: string;

    @Column({ type: "text" })
    roll: string;

    @Column({ type: "text" })
    session: string;

    @Column({ type: "text", nullable: true })
    image: string;

    @Column({ type: "text" })
    gender: string;

    @Column({ type: "text" })
    dob: string;

    @Column({ type: "text", nullable: true })
    blood: string;

    @Column({ type: "text", nullable: true })
    religion: string;

    @Column({ type: "text", nullable: true })
    number: string;

    @Column({ type: "text", nullable: true })
    email: string;

    @Column({ type: "text" })
    admissionDate: string;

    @Column({ type: "text", nullable: true })
    birthCertificate: string;

    @Column({ type: "text" })
    fatherName: string;

    @Column({ type: "text", nullable: true })
    fatherNidNumber: string;

    @Column({ type: "text", nullable: true })
    fatherPhone: string;

    @Column({ type: "text" })
    motherName: string;

    @Column({ type: "text", nullable: true })
    motherNidNumber: string;

    @Column({ type: "text", nullable: true })
    motherPhone: string;

    @Column({ type: "text", nullable: true })
    guardianName: string;

    @Column({ type: "text", nullable: true })
    guardianNidNumber: string;

    @Column({ type: "text", nullable: true })
    guardianPhone: string;

    @Column({ type: "text" })
    fee_start: string;

    @Column({ type: "text" })
    address: string;

    @Column({ type: "text" })
    school: string;

    @ManyToOne(() => User)
    createdBy: Relation<User>;

    @ManyToOne(() => User)
    accountId: Relation<User>;

    @ManyToOne(() => User)
    parentId: Relation<User>;

    @Column({ type: "boolean", default: false })
    leave: boolean;

    @Column({ type: "boolean", default: false })
    complete: boolean;

    @UpdateDateColumn({ type: "timestamptz" })
    updated_at: Date;

    @CreateDateColumn({ type: "timestamptz" })
    created_at: Date;
}