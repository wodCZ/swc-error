import { Resolver, Mutation, Query, Args, Context } from "@nestjs/graphql";

//Service
import { ShiftService } from "./shift.service";

//Dto
import { ShiftInput } from "./dto/shift.dto";
import { SearchInput } from "@/section/dto/search.dto";

//Entities
import { SuccessInfo } from "@/user/entities/success.entity";
import { GetShift, Shift } from "./entity/shift.entity";

//Auth guards
import { AuthGuard } from "@/auth/auth.guard";
import { RolesGuard } from "@/auth/roles.guard";
import { Role } from "@/auth/enum/auth.enum";
import { Roles } from "@/auth/decorator/auth.decorator";

//Req user
import { ReqUser } from "@/auth/Types/user.types";
import { UseGuards } from "@nestjs/common";

@Resolver()
export class ShiftResolver {
    //Constructor
    constructor(
        private readonly shiftService: ShiftService
    ) { };

    //Gets shift list with pagination
    @Query(() => GetShift, { name: "getShifts" })
    @Roles(Role.TEACHER, Role.ACCOUNTANT, Role.PRINCIPAL)
    gets(
        @Args("searchInput") searchInput: SearchInput
    ) {
        return this.shiftService.gets(searchInput);
    };

    //Gets shift list without pagination
    @Query(() => [Shift], { name: "getAllShifts" })
    @Roles(Role.TEACHER, Role.ACCOUNTANT, Role.PRINCIPAL)
    getAll() {
        return this.shiftService.getAll();
    };

    //Add shift
    @Mutation(() => SuccessInfo, { name: "addShift" })
    @Roles(Role.ACCOUNTANT, Role.PRINCIPAL)
    @UseGuards(AuthGuard, RolesGuard)
    create(
        @Args("shiftInput") shiftInput: ShiftInput,
        @Context("user") reqUser: ReqUser
    ) {
        return this.shiftService.create(shiftInput, reqUser);
    };

    //Update shift
    @Mutation(() => SuccessInfo, { name: "updateShift" })
    @Roles(Role.ACCOUNTANT, Role.PRINCIPAL)
    @UseGuards(AuthGuard, RolesGuard)
    update(
        @Args("shiftInput") shiftInput: ShiftInput,
        @Args("id") id: string,
        @Context("user") reqUser: ReqUser
    ) {
        return this.shiftService.update(shiftInput, id, reqUser);
    };

    //Delete Shift
    @Mutation(() => SuccessInfo, { name: "deleteShift" })
    @Roles(Role.ACCOUNTANT, Role.PRINCIPAL)
    @UseGuards(AuthGuard, RolesGuard)
    delete(
        @Args("id") id: string
    ) {
        return this.shiftService.delete(id);
    };
}