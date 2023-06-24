import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

//Orm Entity
import { Attendance } from "./model/attendance.entity";
import { StudentAttendance } from "./model/student-attendance.entity";
import { Student } from "@/student/model/student.entity";

//Dto
import { AttendanceInput } from "./dto/attendance.dto";
import { PresentInput } from "./dto/present.dto";

//Req user
import { ReqUser } from "@/auth/Types/user.types";

@Injectable()
export class AttendanceService {
    //Constructor
    constructor(
        @InjectRepository(Attendance) private attendanceRepository: Repository<Attendance>,
        @InjectRepository(StudentAttendance) private studentAttendanceRepository: Repository<StudentAttendance>,
        @InjectRepository(Student) private studentRepository: Repository<Student>
    ) { };

    //Get attendance report
    async gets() {
        return "This is from attendance"
    };

    //Create attendance sheet
    async create(attendanceInput: AttendanceInput, reqUser: ReqUser) {
        const attendance = await this.attendanceRepository.findOneBy({
            date: attendanceInput.date,
            class: { id: attendanceInput.class },
            shift: { id: attendanceInput.shift },
            section: { id: attendanceInput.section },
            ...(attendanceInput.group !== "" ? { group: { id: attendanceInput.group } } : {})
        });
        if (attendance) {
            const studentList = await this.studentAttendanceRepository.find({
                where: {
                    attendance: { id: attendance.id }
                },
                relations: {
                    student: {
                        class: true
                    }
                }
            });
            return studentList;
        } else {
            const students = await this.studentRepository.find({
                where: {
                    class: { id: attendanceInput.class },
                    shift: { id: attendanceInput.shift },
                    section: { id: attendanceInput.section },
                    ...(attendanceInput.group !== "" ? { group: { id: attendanceInput.group } } : {}),
                    complete: false,
                    leave: false
                }
            });
            if (students.length === 0) throw new NotFoundException("No student in this class!");
            const newStudent = students.map((item) => {
                const newStudentAttendance = this.studentAttendanceRepository.create({
                    student: item
                });
                return newStudentAttendance;
            })
            await this.studentAttendanceRepository.save(newStudent);
            const newAttendance = this.attendanceRepository.create({
                date: attendanceInput.date,
                class: { id: attendanceInput.class },
                shift: { id: attendanceInput.shift },
                section: { id: attendanceInput.section },
                ...(attendanceInput.group !== "" ? { group: { id: attendanceInput.group } } : {}),
                teacher: { id: reqUser.id },
                student: newStudent
            });
            await this.attendanceRepository.save(newAttendance);
            const studentList = await this.studentAttendanceRepository.find({
                where: {
                    attendance: { id: newAttendance.id }
                },
                relations: {
                    student: {
                        class: true
                    }
                }
            });
            return studentList;
        }
    };

    //Add Present
    async present(presentInput: PresentInput) {
        const result = await this.studentAttendanceRepository.update(presentInput.id, {
            present: presentInput.present
        });
        if (result.affected === 0) throw new NotFoundException("Student id not found!");
        return {
            success: true,
            message: "Attendance added successfully!"
        }
    };
}