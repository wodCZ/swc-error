import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

//Entities
import { Notification, Receivers } from "./model/notification.entity";

//Service and Resolver
import { NotificationService } from "./notification.service";
import { NotificationResolver } from "./notification.resolver";

//Module
import { UserModule } from "@/user/user.module";
import { StudentModule } from "@/student/student.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Receivers, Notification]),
        UserModule,
        StudentModule
    ],
    providers: [NotificationService, NotificationResolver],
    exports: [TypeOrmModule]
})

export class NotificationModule { };