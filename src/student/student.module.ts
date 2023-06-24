import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

//Service and Resolver
import { StudentService } from "./student.service";
import { StudentResolver } from "./student.resolver";

//Orm entity
import { Student } from "./model/student.entity";

//Modules
import { UserModule } from "@/user/user.module";
import { SubjectModule } from "@/subject/subject.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Student]),
        UserModule,
        SubjectModule
    ],
    providers: [StudentService, StudentResolver],
    exports: [TypeOrmModule]
})

export class StudentModule { };