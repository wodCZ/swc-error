import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

//Entities
import { Expense } from "./model/expense.entity";
import { ExpenseHead } from "./model/expense-head.entity";

//Service and Resolver
import { ExpenseService } from "./expense.service";
import { ExpenseResolver } from "./expense.resolver";

//Modules
import { UserModule } from "@/user/user.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([ExpenseHead, Expense]),
        UserModule
    ],
    providers: [ExpenseService, ExpenseResolver]
})

export class ExpenseModule { };