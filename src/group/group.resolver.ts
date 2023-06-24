import { UseGuards } from "@nestjs/common";
import { Resolver, Query, Mutation, Args, Context } from "@nestjs/graphql";

//Service
import { GroupService } from "./group.service";

//Dto
import { GroupInput } from "./dto/group.dto";
import { SearchInput } from "@/section/dto/search.dto";

//Entities
import { SuccessInfo } from "@/user/entities/success.entity";
import { GetGroup, Group } from "./entities/group.entity";

//Auth guards
import { AuthGuard } from "@/auth/auth.guard";
import { RolesGuard } from "@/auth/roles.guard";
import { Role } from "@/auth/enum/auth.enum";
import { Roles } from "@/auth/decorator/auth.decorator";

//Req user
import { ReqUser } from "@/auth/Types/user.types";


@Resolver()
export class GroupResolver {
    //Constructor
    constructor(
        private readonly groupService: GroupService
    ) { };

    //Get Groups with pagination
    @Query(() => GetGroup, { name: "getGroups" })
    @Roles(Role.TEACHER, Role.ACCOUNTANT, Role.PRINCIPAL)
    @UseGuards(AuthGuard, RolesGuard)
    gets(
        @Args("searchInput") searchInput: SearchInput
    ) {
        return this.groupService.gets(searchInput);
    };

    //Get Groups without pagination
    @Query(() => [Group], { name: "getAllGroups" })
    @Roles(Role.TEACHER, Role.ACCOUNTANT, Role.PRINCIPAL)
    @UseGuards(AuthGuard, RolesGuard)
    getAll() {
        return this.groupService.getAll();
    };

    //Create group
    @Mutation(() => SuccessInfo, { name: "createGroup" })
    @Roles(Role.ACCOUNTANT, Role.PRINCIPAL)
    @UseGuards(AuthGuard, RolesGuard)
    create(
        @Args("groupInput") groupInput: GroupInput,
        @Context("user") reqUser: ReqUser
    ) {
        return this.groupService.create(groupInput, reqUser);
    };

    //Update group
    @Mutation(() => SuccessInfo, { name: "updateGroup" })
    @Roles(Role.ACCOUNTANT, Role.PRINCIPAL)
    @UseGuards(AuthGuard, RolesGuard)
    update(
        @Args("groupInput") groupInput: GroupInput,
        @Args("id") id: string,
        @Context("user") reqUser: ReqUser
    ) {
        return this.groupService.update(groupInput, id, reqUser);
    };

    //Delete group
    @Mutation(() => SuccessInfo, { name: "deleteGroup" })
    @Roles(Role.ACCOUNTANT, Role.PRINCIPAL)
    @UseGuards(AuthGuard, RolesGuard)
    delete(
        @Args("id") id: string
    ) {
        return this.groupService.delete(id)
    };
}