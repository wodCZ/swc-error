import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn, ManyToOne, Relation } from "typeorm";

//Orm Entity
import { Student } from "@/student/model/student.entity";
import { Attendance } from "./attendance.entity";

@Entity()
export class StudentAttendance {
    @PrimaryGeneratedColumn("identity")
    id: string;

    @Column({ type: "text", enum: ["present", "absent", "late", "not-set"], default: "not-set" })
    present: string;

    @ManyToOne(() => Student)
    student: Relation<Student>;

    @ManyToOne(() => Attendance, (attendance) => attendance.student)
    attendance: Relation<Attendance>;

    @UpdateDateColumn({ type: "timestamptz" })
    updated_at: Date;

    @CreateDateColumn({ type: "timestamptz" })
    created_at: Date;
}