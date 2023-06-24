import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

//Service and Resolver
import { GroupService } from "./group.service";
import { GroupResolver } from "./group.resolver";

//Orm Entity
import { Group } from "./model/group.entity";

//Modules
import { UserModule } from "@/user/user.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Group]),
        UserModule
    ],
    providers: [GroupService, GroupResolver],
    exports: [TypeOrmModule]
})

export class GroupModule { };