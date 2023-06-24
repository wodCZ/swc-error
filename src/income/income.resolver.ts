import { UseGuards } from "@nestjs/common";
import { Resolver, Mutation, Query, Args, Context } from "@nestjs/graphql";

//Service
import { IncomeService } from "./income.service";

//Entities
import { SuccessInfo } from "@/user/entities/success.entity";
import { GetIncomeHead, IncomeHead } from "./entities/income-head.entity";
import { GetIncome, Income } from "./entities/income.entity";

//Dto
import { IncomeHeadInput } from "./dto/income-head.dto";
import { SearchInput } from "@/section/dto/search.dto";
import { IncomeInput } from "./dto/income.dto";

//Auth guards
import { AuthGuard } from "@/auth/auth.guard";
import { RolesGuard } from "@/auth/roles.guard";
import { Role } from "@/auth/enum/auth.enum";
import { Roles } from "@/auth/decorator/auth.decorator";

//Req user
import { ReqUser } from "@/auth/Types/user.types";

@Resolver()
export class IncomeResolver {
    //Constructor
    constructor(
        private readonly incomeService: IncomeService
    ) { };


    //-------------------------------------Head--------------------------------------//
    //Get Income Heads with pagination
    @Query(() => GetIncomeHead, { name: "getIncomeHeads" })
    @Roles(Role.ACCOUNTANT, Role.PRINCIPAL)
    @UseGuards(AuthGuard, RolesGuard)
    getHeads(
        @Args("searchInput") searchInput: SearchInput
    ) {
        return this.incomeService.getHeads(searchInput);
    };

    //Get Income Heads without pagination
    @Query(() => [IncomeHead], { name: "getAllIncomeHead" })
    @Roles(Role.ACCOUNTANT, Role.PRINCIPAL)
    @UseGuards(AuthGuard, RolesGuard)
    getAllHead() {
        return this.incomeService.getAllHead();
    };

    //Add Income Head
    @Mutation(() => SuccessInfo, { name: "addIncomeHead" })
    @Roles(Role.ACCOUNTANT, Role.PRINCIPAL)
    @UseGuards(AuthGuard, RolesGuard)
    addHead(
        @Args("incomeHeadInput") incomeHeadInput: IncomeHeadInput,
        @Context("user") reqUser: ReqUser
    ) {
        return this.incomeService.addHead(incomeHeadInput, reqUser);
    };

    //Update Income Head
    @Mutation(() => SuccessInfo, { name: "updateIncomeHead" })
    @Roles(Role.ACCOUNTANT, Role.PRINCIPAL)
    @UseGuards(AuthGuard, RolesGuard)
    updateHead(
        @Args("incomeHeadInput") incomeHeadInput: IncomeHeadInput,
        @Args("id") id: string,
        @Context("user") reqUser: ReqUser
    ) {
        return this.incomeService.updateHead(incomeHeadInput, id, reqUser);
    };

    //Delete Income Head
    @Mutation(() => SuccessInfo, { name: "deleteIncomeHead" })
    @Roles(Role.ACCOUNTANT, Role.PRINCIPAL)
    @UseGuards(AuthGuard, RolesGuard)
    deleteHead(
        @Args("id") id: string
    ) {
        return this.incomeService.deleteHead(id);
    };

    //-------------------------------------Income------------------------------------//
    //Get Incomes with pagination
    @Query(() => GetIncome, { name: "getIncomes" })
    @Roles(Role.ACCOUNTANT, Role.PRINCIPAL)
    @UseGuards(AuthGuard, RolesGuard)
    getIncomes(
        @Args("searchInput") searchInput: SearchInput
    ) {
        return this.incomeService.getIncomes(searchInput);
    };

    //Get Incomes without pagination
    @Query(() => [Income], { name: "getAllIncome" })
    @Roles(Role.ACCOUNTANT, Role.PRINCIPAL)
    @UseGuards(AuthGuard, RolesGuard)
    getAllIncome() {
        return this.incomeService.getAllIncome();
    };

    //Add Income
    @Mutation(() => SuccessInfo, { name: "addIncome" })
    @Roles(Role.ACCOUNTANT, Role.PRINCIPAL)
    @UseGuards(AuthGuard, RolesGuard)
    addIncome(
        @Args("incomeInput") incomeInput: IncomeInput,
        @Context("user") reqUser: ReqUser
    ) {
        return this.incomeService.addIncome(incomeInput, reqUser);
    };

    //Update Income
    @Mutation(() => SuccessInfo, { name: "updateIncome" })
    @Roles(Role.ACCOUNTANT, Role.PRINCIPAL)
    @UseGuards(AuthGuard, RolesGuard)
    updateIncome(
        @Args("incomeInput") incomeInput: IncomeInput,
        @Args("id") id: string,
        @Context("user") reqUser: ReqUser
    ) {
        return this.incomeService.updateIncome(incomeInput, id, reqUser);
    };

    //Delete Income
    @Mutation(() => SuccessInfo, { name: "deleteIncome" })
    @Roles(Role.ACCOUNTANT, Role.PRINCIPAL)
    @UseGuards(AuthGuard, RolesGuard)
    deleteIncome(
        @Args("id") id: string
    ) {
        return this.incomeService.deleteIncome(id);
    };
}