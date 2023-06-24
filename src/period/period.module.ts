import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

//Orm Entity
import { Period } from "./model/period.entity";

//Service and Resolver
import { PeriodService } from "./period.service";
import { PeriodResolver } from "./period.resolver";

//Modules
import { UserModule } from "@/user/user.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Period]),
        UserModule
    ],
    providers: [PeriodService, PeriodResolver],
    exports: [TypeOrmModule]
})

export class PeriodModule { };