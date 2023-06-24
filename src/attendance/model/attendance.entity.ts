import { Entity, Column, PrimaryGeneratedColumn, OneToMany, UpdateDateColumn, CreateDateColumn, ManyToOne, Relation } from "typeorm";

//Orm Entity
import { User } from "@/user/model/user.entity";
import { Class } from "@/class/model/class.entity";
import { Shift } from "@/shift/model/shift.entity";
import { Section } from "@/section/model/section.entity";
import { Group } from "@/group/model/group.entity";
import { StudentAttendance } from "./student-attendance.entity";

@Entity()
export class Attendance {
    @PrimaryGeneratedColumn("identity")
    id: string;

    @Column({ type: "text" })
    date: string;

    @ManyToOne(() => Class)
    class: Relation<Class>;

    @ManyToOne(() => Shift)
    shift: Relation<Shift>;

    @ManyToOne(() => Section)
    section: Relation<Section>;

    @ManyToOne(() => Group)
    group: Relation<Group>;

    @ManyToOne(() => User)
    teacher: Relation<User>;

    @OneToMany(() => StudentAttendance, (student) => student.attendance, { cascade: true })
    student: Relation<StudentAttendance[]>;

    @UpdateDateColumn({ type: "timestamptz" })
    updated_at: Date;

    @CreateDateColumn({ type: "timestamptz" })
    created_at: Date;
}