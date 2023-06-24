import { UseGuards } from "@nestjs/common";
import { Resolver, Query, Mutation, Args, Context } from "@nestjs/graphql";

//Service
import { ClassService } from "./class.service";

//Dto
import { ClassInput } from "./dto/class.dto";
import { SearchInput } from "@/section/dto/search.dto";

//Entities
import { SuccessInfo } from "@/user/entities/success.entity";
import { GetClass, Class } from "./entities/class.entity";

//Auth guards
import { AuthGuard } from "@/auth/auth.guard";
import { RolesGuard } from "@/auth/roles.guard";
import { Role } from "@/auth/enum/auth.enum";
import { Roles } from "@/auth/decorator/auth.decorator";

//Req user
import { ReqUser } from "@/auth/Types/user.types";

@Resolver()
export class ClassResolver {
    //Constructor
    constructor(
        private readonly classService: ClassService
    ) { };

    //Gets with pagination
    @Query(() => GetClass, { name: "getClasses" })
    @Roles(Role.TEACHER, Role.ACCOUNTANT, Role.PRINCIPAL)
    @UseGuards(AuthGuard, RolesGuard)
    gets(
        @Args("searchInput") searchInput: SearchInput
    ) {
        return this.classService.gets(searchInput);
    };

    //Gets without pagination
    @Query(() => [Class], { name: "getAllClass" })
    @Roles(Role.TEACHER, Role.ACCOUNTANT, Role.PRINCIPAL)
    @UseGuards(AuthGuard, RolesGuard)
    getAll() {
        return this.classService.getAll();
    };

    //Create Class
    @Mutation(() => SuccessInfo, { name: "addClass" })
    @Roles(Role.ACCOUNTANT, Role.PRINCIPAL)
    @UseGuards(AuthGuard, RolesGuard)
    create(
        @Args("classInput") classInput: ClassInput,
        @Context("user") reqUser: ReqUser
    ) {
        return this.classService.create(classInput, reqUser);
    };

    //Update class
    @Mutation(() => SuccessInfo, { name: "updateClass" })
    @Roles(Role.ACCOUNTANT, Role.PRINCIPAL)
    @UseGuards(AuthGuard, RolesGuard)
    update(
        @Args("classInput") classInput: ClassInput,
        @Args("id") id: string,
        @Context("user") reqUser: ReqUser
    ) {
        return this.classService.update(classInput, id, reqUser);
    };

    //Delete Class
    @Mutation(() => SuccessInfo, { name: "deleteClass" })
    @Roles(Role.ACCOUNTANT, Role.PRINCIPAL)
    @UseGuards(AuthGuard, RolesGuard)
    delete(
        @Args("id") id: string
    ) {
        return this.classService.delete(id)
    };
}