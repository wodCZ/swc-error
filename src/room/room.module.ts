import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

//Orm Entity
import { Room } from "./model/room.entity";

//Service and Resolver
import { RoomService } from "./room.service";
import { RoomResolver } from "./room.resolver";

//Modules
import { UserModule } from "@/user/user.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Room]),
        UserModule
    ],
    providers: [RoomService, RoomResolver],
    exports: [TypeOrmModule]
})

export class RoomModule { }