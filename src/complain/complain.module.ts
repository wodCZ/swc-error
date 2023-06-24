import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

//Orm Entity
import { Complain } from "./model/complain.entity";

//Service and Resolver
import { ComplainService } from "./complain.service";
import { ComplainResolver } from "./complain.resolver";


//Modules
import { UserModule } from "@/user/user.module";
import { NotificationModule } from "@/Notification/notification.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Complain]),
        UserModule,
        NotificationModule
    ],
    providers: [ComplainService, ComplainResolver]
})

export class ComplainModule { };