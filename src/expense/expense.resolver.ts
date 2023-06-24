import { UseGuards } from "@nestjs/common";
import { Resolver, Mutation, Query, Args, Context } from "@nestjs/graphql";

//Service
import { ExpenseService } from "./expense.service";

//Dto
import { ExpenseHeadInput } from "./dto/expense-head.dto";
import { SearchInput } from "@/section/dto/search.dto";
import { ExpenseInput } from "./dto/expense.dto";

//Entities
import { SuccessInfo } from "@/user/entities/success.entity";
import { GetExpenseHead, ExpenseHead } from "./entities/expense-head.entity";
import { GetExpense, Expense } from "./entities/expense.entity";

//Auth guards
import { AuthGuard } from "@/auth/auth.guard";
import { RolesGuard } from "@/auth/roles.guard";
import { Role } from "@/auth/enum/auth.enum";
import { Roles } from "@/auth/decorator/auth.decorator";

//Req user
import { ReqUser } from "@/auth/Types/user.types";

@Resolver()
export class ExpenseResolver {
    //Constructor
    constructor(
        private readonly expenseService: ExpenseService
    ) { };

    //--------------------------------Head-------------------------------------------//
    //Get head with pagination
    @Query(() => GetExpenseHead, { name: "getExpenseHeads" })
    @Roles(Role.ACCOUNTANT, Role.PRINCIPAL)
    @UseGuards(AuthGuard, RolesGuard)
    getHeads(
        @Args("searchInput") searchInput: SearchInput
    ) {
        return this.expenseService.getHeads(searchInput);
    };

    //Get head without pagination
    @Query(() => [ExpenseHead], { name: "getAllExpenseHead" })
    @Roles(Role.ACCOUNTANT, Role.PRINCIPAL)
    @UseGuards(AuthGuard, RolesGuard)
    getAllHead() {
        return this.expenseService.getAllHead();
    };

    //Add Expense Head
    @Mutation(() => SuccessInfo, { name: "addExpenseHead" })
    @Roles(Role.ACCOUNTANT, Role.PRINCIPAL)
    @UseGuards(AuthGuard, RolesGuard)
    addHead(
        @Args("expenseHeadInput") expenseHeadInput: ExpenseHeadInput,
        @Context("user") reqUser: ReqUser
    ) {
        return this.expenseService.addHead(expenseHeadInput, reqUser);
    };

    //Update Expense Head
    @Mutation(() => SuccessInfo, { name: "updateExpenseHead" })
    @Roles(Role.ACCOUNTANT, Role.PRINCIPAL)
    @UseGuards(AuthGuard, RolesGuard)
    updateHead(
        @Args("expenseHeadInput") expenseHeadInput: ExpenseHeadInput,
        @Args("id") id: string,
        @Context("user") reqUser: ReqUser
    ) {
        return this.expenseService.updateHead(expenseHeadInput, id, reqUser);
    };

    //Delete Expense Head
    @Mutation(() => SuccessInfo, { name: "deleteExpenseHead" })
    @Roles(Role.ACCOUNTANT, Role.PRINCIPAL)
    @UseGuards(AuthGuard, RolesGuard)
    deleteHead(
        @Args("id") id: string
    ) {
        return this.expenseService.deleteHead(id);
    };

    //---------------------------------Expense Head---------------------------------//

    //Get expenses with pagination
    @Query(() => GetExpense, { name: "getExpenses" })
    @Roles(Role.ACCOUNTANT, Role.PRINCIPAL)
    @UseGuards(AuthGuard, RolesGuard)
    getExpense(
        @Args("searchInput") searchInput: SearchInput
    ) {
        return this.expenseService.getExpense(searchInput);
    };

    //Get expenses without pagination
    @Query(() => [Expense], { name: "getAllExpense" })
    @Roles(Role.ACCOUNTANT, Role.PRINCIPAL)
    @UseGuards(AuthGuard, RolesGuard)
    getAllExpense() {
        return this.expenseService.getAllExpense();
    };

    //Add Expense
    @Mutation(() => SuccessInfo, { name: "addExpense" })
    @Roles(Role.ACCOUNTANT, Role.PRINCIPAL)
    @UseGuards(AuthGuard, RolesGuard)
    addExpense(
        @Args("expenseInput") expenseInput: ExpenseInput,
        @Context("user") reqUser: ReqUser
    ) {
        return this.expenseService.addExpense(expenseInput, reqUser)
    };

    //Update Expense
    @Mutation(() => SuccessInfo, { name: "updateExpense" })
    @Roles(Role.ACCOUNTANT, Role.PRINCIPAL)
    @UseGuards(AuthGuard, RolesGuard)
    updateExpense(
        @Args("expenseInput") expenseInput: ExpenseInput,
        @Args("id") id: string,
        @Context("user") reqUser: ReqUser
    ) {
        return this.expenseService.updateExpense(expenseInput, id, reqUser);
    };

    //Delete Expense
    @Mutation(() => SuccessInfo, { name: "deleteExpense" })
    @Roles(Role.ACCOUNTANT, Role.PRINCIPAL)
    @UseGuards(AuthGuard, RolesGuard)
    deleteExpense(
        @Args("id") id: string
    ) {
        return this.expenseService.deleteExpense(id);
    };
}