import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

//Orm Entity
import { Subject } from "./model/subject.entity";

//Service and Resolver
import { SubjectService } from "./subject.service";
import { SubjectResolver } from "./subject.resolver";

//Modules
import { UserModule } from "@/user/user.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Subject]),
        UserModule
    ],
    providers: [SubjectService, SubjectResolver],
    exports: [TypeOrmModule]
})
export class SubjectModule { };