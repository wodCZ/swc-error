import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

//Orm Entity
import { Attendance } from "./model/attendance.entity";
import { StudentAttendance } from "./model/student-attendance.entity";

//Service and Resolver
import { AttendanceService } from "./attendance.service";
import { AttendanceResolver } from "./attendance.resolver";

//Modules
import { UserModule } from "@/user/user.module";
import { StudentModule } from "@/student/student.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Attendance, StudentAttendance]),
        UserModule,
        StudentModule
    ],
    providers: [AttendanceService, AttendanceResolver]
})

export class AttendanceModule { };