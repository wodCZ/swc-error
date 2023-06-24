import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

//Service and Resolver
import { SectionService } from "./section.service";
import { SectionResolver } from "./section.resolver";

//Orm Entity
import { Section } from "./model/section.entity";

//Modules
import { UserModule } from "@/user/user.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Section]),
        UserModule
    ],
    providers: [SectionService, SectionResolver],
    exports: [TypeOrmModule]
})

export class SectionModule { }