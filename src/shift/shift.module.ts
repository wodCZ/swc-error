import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

//Entities
import { Shift } from "./model/shift.entity";

//Service and Resolver
import { ShiftService } from "./shift.service";
import { ShiftResolver } from "./shift.resolver";

//Modules
import { UserModule } from "@/user/user.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Shift]),
        UserModule
    ],
    providers: [ShiftService, ShiftResolver],
    exports: [TypeOrmModule]
})

export class ShiftModule { };