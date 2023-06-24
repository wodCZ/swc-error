import { UseGuards } from "@nestjs/common";
import { Resolver, Query, Mutation, Args, Context } from "@nestjs/graphql";

//Service
import { ComplainService } from "./complain.service";

//Dto
import { ComplainInput } from "./dto/complain.dto";
import { SearchInput } from "@/section/dto/search.dto";
import { ComplainStatusInput } from "./dto/status.dto";

//Entities
import { SuccessInfo } from "@/user/entities/success.entity";
import { GetComplain, Complain } from "./entity/complain.entity";

//Auth guards
import { AuthGuard } from "@/auth/auth.guard";
import { RolesGuard } from "@/auth/roles.guard";
import { Role } from "@/auth/enum/auth.enum";
import { Roles } from "@/auth/decorator/auth.decorator";

//Req user
import { ReqUser } from "@/auth/Types/user.types";

@Resolver()
export class ComplainResolver {
    //Constructor
    constructor(
        private readonly complainService: ComplainService
    ) { };

    //Get complain list with pagination
    @Query(() => GetComplain, { name: "getComplains" })
    @Roles(Role.ACCOUNTANT, Role.PRINCIPAL)
    @UseGuards(AuthGuard, RolesGuard)
    async gets(
        @Args("searchInput") searchInput: SearchInput
    ) {
        return this.complainService.gets(searchInput);
    };

    //Get complain list without pagination
    @Query(() => [Complain], { name: "getAllComplain" })
    @Roles(Role.ACCOUNTANT, Role.PRINCIPAL)
    @UseGuards(AuthGuard, RolesGuard)
    async getAll() {
        return this.complainService.getAll();
    };

    //Add Complain
    @Mutation(() => SuccessInfo, { name: "addComplain" })
    @Roles(Role.STUDENT, Role.PARENTS)
    @UseGuards(AuthGuard, RolesGuard)
    add(
        @Args("complainInput") complainInput: ComplainInput,
        @Context("user") reqUser: ReqUser
    ) {
        return this.complainService.add(complainInput, reqUser);
    };

    //Update Complain
    @Mutation(() => SuccessInfo, { name: "updateComplainStatus" })
    @Roles(Role.ACCOUNTANT, Role.PRINCIPAL)
    @UseGuards(AuthGuard, RolesGuard)
    status(
        @Args("complainStatusInput") complainStatusInput: ComplainStatusInput
    ) {
        return this.complainService.status(complainStatusInput);
    };
}