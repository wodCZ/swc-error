import { UseGuards } from "@nestjs/common";
import { Resolver, Query, Mutation, Args, Context } from "@nestjs/graphql";

//Service
import { RoomService } from "./room.service";

//Dto
import { RoomInput } from "./dto/room.dto";
import { SearchInput } from "@/section/dto/search.dto";

//Entities
import { SuccessInfo } from "@/user/entities/success.entity";
import { GetRoom, Room } from "./entities/room.entity";

//Auth guards
import { AuthGuard } from "@/auth/auth.guard";
import { RolesGuard } from "@/auth/roles.guard";
import { Role } from "@/auth/enum/auth.enum";
import { Roles } from "@/auth/decorator/auth.decorator";

//Req user
import { ReqUser } from "@/auth/Types/user.types";


@Resolver()
export class RoomResolver {
    //Constructor
    constructor(
        private readonly roomService: RoomService
    ) { };

    //Get room list with pagination
    @Query(() => GetRoom, { name: "getRooms" })
    @Roles(Role.TEACHER, Role.ACCOUNTANT, Role.PRINCIPAL)
    @UseGuards(AuthGuard, RolesGuard)
    gets(
        @Args("searchInput") searchInput: SearchInput
    ) {
        return this.roomService.gets(searchInput);
    };

    //Get room list without pagination
    @Query(() => [Room], { name: "getAllRoom" })
    @Roles(Role.TEACHER, Role.ACCOUNTANT, Role.PRINCIPAL)
    @UseGuards(AuthGuard, RolesGuard)
    getAll() {
        return this.roomService.getAll();
    };

    //Create room
    @Mutation(() => SuccessInfo, { name: "addRoom" })
    @Roles(Role.ACCOUNTANT, Role.PRINCIPAL)
    @UseGuards(AuthGuard, RolesGuard)
    create(
        @Args("roomInput") roomInput: RoomInput,
        @Context("user") reqUser: ReqUser
    ) {
        return this.roomService.create(roomInput, reqUser);
    };

    //Update room
    @Mutation(() => SuccessInfo, { name: "updateRoom" })
    @Roles(Role.ACCOUNTANT, Role.PRINCIPAL)
    @UseGuards(AuthGuard, RolesGuard)
    update(
        @Args("roomInput") roomInput: RoomInput,
        @Args("id") id: string,
        @Context("user") reqUser: ReqUser
    ) {
        return this.roomService.update(roomInput, id, reqUser);
    }

    //Delete Room
    @Mutation(() => SuccessInfo, { name: "deleteRoom" })
    @Roles(Role.ACCOUNTANT, Role.PRINCIPAL)
    @UseGuards(AuthGuard, RolesGuard)
    delete(
        @Args("id") id: string,
    ) {
        return this.roomService.delete(id);
    }
}