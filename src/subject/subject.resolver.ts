import { UseGuards } from "@nestjs/common";
import { Resolver, Query, Mutation, Args, Context } from "@nestjs/graphql";

//Service
import { SubjectService } from "./subject.service";

//Dto
import { SubjectInput } from "./dto/subject.dto";
import { SearchInput } from "@/section/dto/search.dto";

//Entities
import { SuccessInfo } from "@/user/entities/success.entity";
import { GetSubject, Subject } from "./entities/subject.entity";

//Auth guards
import { AuthGuard } from "@/auth/auth.guard";
import { RolesGuard } from "@/auth/roles.guard";
import { Role } from "@/auth/enum/auth.enum";
import { Roles } from "@/auth/decorator/auth.decorator";

//Req user
import { ReqUser } from "@/auth/Types/user.types";


@Resolver()
export class SubjectResolver {
    //Constructor
    constructor(
        private readonly subjectService: SubjectService
    ) { };

    //Gets subject list with pagination
    @Query(() => GetSubject, { name: "getSubjects" })
    @Roles(Role.TEACHER, Role.ACCOUNTANT, Role.PRINCIPAL)
    @UseGuards(AuthGuard, RolesGuard)
    gets(
        @Args("searchInput") searchInput: SearchInput
    ) {
        return this.subjectService.gets(searchInput)
    };

    //Get subject list without pagination
    @Query(() => [Subject], { name: "getAllSubject" })
    @Roles(Role.TEACHER, Role.ACCOUNTANT, Role.PRINCIPAL)
    @UseGuards(AuthGuard, RolesGuard)
    getAll() {
        return this.subjectService.getAll()
    };

    //Create Subject
    @Mutation(() => SuccessInfo, { name: "addSubject" })
    @Roles(Role.ACCOUNTANT, Role.PRINCIPAL)
    @UseGuards(AuthGuard, RolesGuard)
    create(
        @Args("subjectInput") subjectInput: SubjectInput,
        @Context("user") reqUser: ReqUser
    ) {
        return this.subjectService.create(subjectInput, reqUser);
    };

    //Update Subject
    @Mutation(() => SuccessInfo, { name: "updateSubject" })
    @Roles(Role.ACCOUNTANT, Role.PRINCIPAL)
    @UseGuards(AuthGuard, RolesGuard)
    update(
        @Args("subjectInput") subjectInput: SubjectInput,
        @Args("id") id: string,
        @Context("user") reqUser: ReqUser
    ) {
        return this.subjectService.update(subjectInput, id, reqUser)
    };

    //Delete Subject
    @Mutation(() => SuccessInfo, { name: "deleteSubject" })
    @Roles(Role.ACCOUNTANT, Role.PRINCIPAL)
    @UseGuards(AuthGuard, RolesGuard)
    delete(
        @Args("id") id: string
    ) {
        return this.subjectService.delete(id)
    };
}