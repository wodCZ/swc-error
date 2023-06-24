import { Module } from "@nestjs/common";

//Service
import { EventService } from "./events.service";

import { UserModule } from "@/user/user.module";
import { StudentModule } from "@/student/student.module";

@Module({
    imports: [
        UserModule,
        StudentModule
    ],
    providers: [EventService],
    exports: [EventService]
})
export class EventModule { };