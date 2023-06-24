import { UseGuards } from "@nestjs/common";
import { Resolver, Query, Mutation, Args, Context } from "@nestjs/graphql";

//Service
import { PeriodService } from "./period.service";

//Dto
import { PeriodInput } from "./dto/period.dto";
import { SearchInput } from "@/section/dto/search.dto";

//Success
import { SuccessInfo } from "@/user/entities/success.entity";
import { GetPeriod, Period } from "./entities/period.entity";

//Auth guards
import { AuthGuard } from "@/auth/auth.guard";
import { RolesGuard } from "@/auth/roles.guard";
import { Role } from "@/auth/enum/auth.enum";
import { Roles } from "@/auth/decorator/auth.decorator";

//Req user
import { ReqUser } from "@/auth/Types/user.types";

@Resolver()
export class PeriodResolver {
    //Constructor
    constructor(
        private readonly periodService: PeriodService
    ) { };

    //Get period list with pagination
    @Query(() => GetPeriod, { name: "getPeriods" })
    @Roles(Role.TEACHER, Role.ACCOUNTANT, Role.PRINCIPAL)
    @UseGuards(AuthGuard, RolesGuard)
    gets(
        @Args("searchInput") searchInput: SearchInput
    ) {
        return this.periodService.gets(searchInput);
    };

    //Get period list without pagination
    @Query(() => [Period], { name: "getAllPeriod" })
    @Roles(Role.TEACHER, Role.ACCOUNTANT, Role.PRINCIPAL)
    @UseGuards(AuthGuard, RolesGuard)
    getAll() {
        return this.periodService.getAll();
    };

    //Create period
    @Mutation(() => SuccessInfo, { name: "addPeriod" })
    @Roles(Role.ACCOUNTANT, Role.PRINCIPAL)
    @UseGuards(AuthGuard, RolesGuard)
    create(
        @Args("periodInput") periodInput: PeriodInput,
        @Context("user") reqUser: ReqUser
    ) {
        return this.periodService.create(periodInput, reqUser);
    };

    //Update Period
    @Mutation(() => SuccessInfo, { name: "updatePeriod" })
    @Roles(Role.ACCOUNTANT, Role.PRINCIPAL)
    @UseGuards(AuthGuard, RolesGuard)
    update(
        @Args("periodInput") periodInput: PeriodInput,
        @Args("id") id: string,
        @Context("user") reqUser: ReqUser
    ) {
        return this.periodService.update(periodInput, id, reqUser);
    };

    //Delete period
    @Mutation(() => SuccessInfo, { name: "deletePeriod" })
    @Roles(Role.ACCOUNTANT, Role.PRINCIPAL)
    @UseGuards(AuthGuard, RolesGuard)
    delete(
        @Args("id") id: string
    ) {
        return this.periodService.delete(id)
    };
}