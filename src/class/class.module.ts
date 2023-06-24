import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

//Orm Entity
import { Class } from "./model/class.entity";

//Service and Resolver
import { ClassService } from "./class.service";
import { ClassResolver } from "./class.resolver";

//Modules
import { UserModule } from "@/user/user.module";
import { SectionModule } from "@/section/section.module";
import { GroupModule } from "@/group/group.module";
import { ShiftModule } from "@/shift/shift.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Class]),
        UserModule,
        SectionModule,
        GroupModule,
        ShiftModule
    ],
    providers: [ClassService, ClassResolver],
    exports: [TypeOrmModule]
})

export class ClassModule { };