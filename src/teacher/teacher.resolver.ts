import { UseGuards } from "@nestjs/common";
import { Resolver, Mutation, Query, Args, Context } from "@nestjs/graphql";

//Service
import { TeacherService } from "./teacher.service";

//Entity
import { SuccessInfo } from "@/user/entities/success.entity";
import { GetTeachers, Teacher } from "./entities/teacher.entity";

//Dto
import { TeacherInput } from "./dto/teacher.dto";
import { SearchInput } from "@/section/dto/search.dto";

//Auth guards
import { AuthGuard } from "@/auth/auth.guard";
import { RolesGuard } from "@/auth/roles.guard";
import { Role } from "@/auth/enum/auth.enum";
import { Roles } from "@/auth/decorator/auth.decorator";

//Req user
import { ReqUser } from "@/auth/Types/user.types";

@Resolver()
export class TeacherResolver {
    //constructor
    constructor(
        private readonly teacherService: TeacherService
    ) { };

    //Get teacher list with pagination
    @Query(() => GetTeachers, { name: "getTeachers" })
    @Roles(Role.ACCOUNTANT, Role.PRINCIPAL)
    @UseGuards(AuthGuard, RolesGuard)
    gets(
        @Args("searchInput") searchInput: SearchInput
    ) {
        return this.teacherService.gets(searchInput);
    };

    //Get teacher list without pagination
    @Query(() => [Teacher], { name: "getAllTeacher" })
    @Roles(Role.ACCOUNTANT, Role.PRINCIPAL)
    @UseGuards(AuthGuard, RolesGuard)
    getAll() {
        return this.teacherService.getAll();
    };

    //Create teacher
    @Mutation(() => SuccessInfo, { name: "addTeacher" })
    @Roles(Role.ACCOUNTANT, Role.PRINCIPAL)
    @UseGuards(AuthGuard, RolesGuard)
    create(
        @Args("teacherInput") teacherInput: TeacherInput,
        @Context("user") reqUser: ReqUser
    ) {
        return this.teacherService.create(teacherInput, reqUser);
    };

    //Update Teacher
    @Mutation(() => SuccessInfo, { name: "updateTeacher" })
    @Roles(Role.ACCOUNTANT, Role.PRINCIPAL)
    @UseGuards(AuthGuard, RolesGuard)
    update(
        @Args("teacherInput") teacherInput: TeacherInput,
        @Args("id") id: string,
        @Context("user") reqUser: ReqUser
    ) {
        return this.teacherService.update(teacherInput, id, reqUser);
    }

    //Delete teacher
    @Mutation(() => SuccessInfo, { name: "deleteTeacher" })
    @Roles(Role.ACCOUNTANT, Role.PRINCIPAL)
    @UseGuards(AuthGuard, RolesGuard)
    delete(
        @Args("id") id: string
    ) {
        return this.teacherService.delete(id);
    };
}
