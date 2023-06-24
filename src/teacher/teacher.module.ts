import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

//Orm Entity
import { Teacher } from "./model/teacher.entity";

//Service and Resolver
import { TeacherService } from "./teacher.service";
import { TeacherResolver } from "./teacher.resolver";

//Modules
import { UserModule } from "@/user/user.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Teacher]),
        UserModule
    ],
    providers: [TeacherService, TeacherResolver],
    exports: [TypeOrmModule]
})

export class TeacherModule { };