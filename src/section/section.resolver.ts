import { UseGuards } from "@nestjs/common";
import { Resolver, Query, Mutation, Args, Context } from "@nestjs/graphql";

//Service
import { SectionService } from "./section.service";

//Entities
import { SuccessInfo } from "@/user/entities/success.entity";
import { GetSection, Section } from "./entities/section.entity";

//Dto
import { SectionInput } from "./dto/section.dto";
import { SearchInput } from "./dto/search.dto";

//Auth guards
import { AuthGuard } from "@/auth/auth.guard";
import { RolesGuard } from "@/auth/roles.guard";
import { Role } from "@/auth/enum/auth.enum";
import { Roles } from "@/auth/decorator/auth.decorator";

//Req user
import { ReqUser } from "@/auth/Types/user.types";

@Resolver()
export class SectionResolver {
    //Constructor
    constructor(
        private readonly sectionService: SectionService
    ) { };

    //Get Section List with pagination
    @Query(() => GetSection, { name: "getSections" })
    @Roles(Role.ACCOUNTANT, Role.PRINCIPAL)
    @UseGuards(AuthGuard, RolesGuard)
    gets(
        @Args("searchInput") searchInput: SearchInput
    ) {
        return this.sectionService.gets(searchInput);
    };

    //Get Section List without pagination
    @Query(() => [Section], { name: "getAllSections" })
    @Roles(Role.ACCOUNTANT, Role.PRINCIPAL)
    @UseGuards(AuthGuard, RolesGuard)
    getAll() {
        return this.sectionService.getAll();
    };

    //Create Section
    @Mutation(() => SuccessInfo, { name: "addSection" })
    @Roles(Role.ACCOUNTANT, Role.PRINCIPAL)
    @UseGuards(AuthGuard, RolesGuard)
    create(
        @Args("sectionInput") sectionInput: SectionInput,
        @Context("user") reqUser: ReqUser
    ) {
        return this.sectionService.create(sectionInput, reqUser);
    };

    //Update Section
    @Mutation(() => SuccessInfo, { name: "updateSection" })
    @Roles(Role.ACCOUNTANT, Role.PRINCIPAL)
    @UseGuards(AuthGuard, RolesGuard)
    update(
        @Args("sectionInput") sectionInput: SectionInput,
        @Args("id") id: string,
        @Context("user") reqUser: ReqUser
    ) {
        return this.sectionService.update(sectionInput, id, reqUser);
    };

    //Delete Section
    @Mutation(() => SuccessInfo, { name: "deleteSection" })
    @Roles(Role.ACCOUNTANT, Role.PRINCIPAL)
    @UseGuards(AuthGuard, RolesGuard)
    delete(
        @Args("id") id: string
    ) {
        return this.sectionService.delete(id);
    };
}