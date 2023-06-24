import { UseGuards } from "@nestjs/common";
import { Resolver, Query, Mutation, Args, Context } from "@nestjs/graphql";

//Service
import { StudentService } from "./student.service";

//Dto
import { StudentInput } from "./dto/student.dto";
import { StudentPaginationInput } from "./dto/student.pagination";
import { StudentPramsInput } from "./dto/student.prams";
import { PromoteInput } from "./dto/promote.dto";

//Entities
import { SuccessInfo } from "@/user/entities/success.entity";
import { GetStudent, Student } from "./entities/student.entity";

//Auth guards
import { AuthGuard } from "@/auth/auth.guard";
import { RolesGuard } from "@/auth/roles.guard";
import { Role } from "@/auth/enum/auth.enum";
import { Roles } from "@/auth/decorator/auth.decorator";

//Req user
import { ReqUser } from "@/auth/Types/user.types";

@Resolver()
export class StudentResolver {
    //Constructor
    constructor(
        private readonly studentService: StudentService
    ) { };

    //Get student list with pagination
    @Query(() => GetStudent, { name: "getStudents" })
    @Roles(Role.ACCOUNTANT, Role.PRINCIPAL)
    @UseGuards(AuthGuard, RolesGuard)
    gets(
        @Args("studentPaginationInput") studentPaginationInput: StudentPaginationInput
    ) {
        return this.studentService.gets(studentPaginationInput);
    };

    //Get student list without pagination
    @Query(() => [Student], { name: "getAllStudent" })
    @Roles(Role.ACCOUNTANT, Role.PRINCIPAL)
    @UseGuards(AuthGuard, RolesGuard)
    getAll(
        @Args("StudentPramsInput") studentPramsInput: StudentPramsInput
    ) {
        return this.studentService.getAll(studentPramsInput);
    };

    //Get student
    @Query(() => Student, { name: "getStudent" })
    @Roles(Role.ACCOUNTANT, Role.PRINCIPAL)
    @UseGuards(AuthGuard, RolesGuard)
    get(
        @Args("id") id: string
    ) {
        return this.studentService.get(id)
    };

    //Get student Profile
    @Query(() => Student, { name: "getStudentProfile" })
    @Roles(Role.STUDENT)
    @UseGuards(AuthGuard, RolesGuard)
    profile(
        @Context("user") reqUser: ReqUser
    ) {
        return this.studentService.profile(reqUser);
    };

    //Add Student
    @Mutation(() => SuccessInfo, { name: "addStudent" })
    @Roles(Role.ACCOUNTANT, Role.PRINCIPAL)
    @UseGuards(AuthGuard, RolesGuard)
    create(
        @Args("studentInput") studentInput: StudentInput,
        @Context("user") reqUser: ReqUser
    ) {
        return this.studentService.create(studentInput, reqUser);
    };

    //Update Student
    @Mutation(() => SuccessInfo, { name: "updateStudent" })
    @Roles(Role.ACCOUNTANT, Role.PRINCIPAL)
    @UseGuards(AuthGuard, RolesGuard)
    update(
        @Args("studentInput") studentInput: StudentInput,
        @Args("id") id: string,
        @Context("user") reqUser: ReqUser
    ) {
        return this.studentService.update(studentInput, id, reqUser);
    };

    //Promote Student
    @Mutation(() => SuccessInfo, { name: "promoteStudent" })
    @Roles(Role.ACCOUNTANT, Role.PRINCIPAL)
    @UseGuards(AuthGuard, RolesGuard)
    promote(
        @Args("promoteInput") promoteInput: PromoteInput
    ) {
        return this.studentService.promote(promoteInput)
    };

    //Delete Student
    @Mutation(() => SuccessInfo, { name: "deleteStudent" })
    @Roles(Role.ACCOUNTANT, Role.PRINCIPAL)
    @UseGuards(AuthGuard, RolesGuard)
    delete(
        @Args("id") id: string
    ) {
        return this.studentService.delete(id);
    };
}