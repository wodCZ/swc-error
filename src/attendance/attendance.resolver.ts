import { UseGuards } from "@nestjs/common";
import { Resolver, Query, Mutation, Args, Context } from "@nestjs/graphql";

//Service
import { AttendanceService } from "./attendance.service";

//Dto
import { AttendanceInput } from "./dto/attendance.dto";
import { PresentInput } from "./dto/present.dto";

//Entities
import { StudentAttendance } from "./entities/student-attendance.dto";
import { SuccessInfo } from "@/user/entities/success.entity";

//Auth guards
import { AuthGuard } from "@/auth/auth.guard";
import { RolesGuard } from "@/auth/roles.guard";
import { Role } from "@/auth/enum/auth.enum";
import { Roles } from "@/auth/decorator/auth.decorator";

//Req user
import { ReqUser } from "@/auth/Types/user.types";

@Resolver()
export class AttendanceResolver {
    //Constructor
    constructor(
        private readonly attendanceService: AttendanceService
    ) { };

    //Get attendance report
    @Query(() => String, { name: "getAttendanceReport" })
    gets() {
        return this.attendanceService.gets();
    };

    //Create attendance sheet
    @Mutation(() => [StudentAttendance], { name: "createAttendanceSheet" })
    @Roles(Role.TEACHER, Role.PRINCIPAL)
    @UseGuards(AuthGuard, RolesGuard)
    create(
        @Args("attendanceInput") attendanceInput: AttendanceInput,
        @Context("user") reqUser: ReqUser
    ) {
        return this.attendanceService.create(attendanceInput, reqUser);
    };

    //Add Present
    @Mutation(() => SuccessInfo, { name: "addPresent" })
    @Roles(Role.TEACHER, Role.PRINCIPAL)
    @UseGuards(AuthGuard, RolesGuard)
    present(
        @Args("presentInput") presentInput: PresentInput
    ) {
        return this.attendanceService.present(presentInput);
    };
}