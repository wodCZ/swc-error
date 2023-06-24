import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

//Entities
import { IncomeHead } from "./model/income-head.entity";
import { Income } from "./model/income.entity";

//Service and Resolver
import { IncomeService } from "./income.service";
import { IncomeResolver } from "./income.resolver";

//Module
import { UserModule } from "@/user/user.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([IncomeHead, Income]),
        UserModule
    ],
    providers: [IncomeService, IncomeResolver]
})
export class IncomeModule { };