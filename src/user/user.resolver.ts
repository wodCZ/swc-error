import { Resolver, Query, Mutation, Args, Context } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { Request } from "express";

//Service
import { UserService } from "./user.service";

//Dto
import { RegistrationInput } from "./dto/registration.dto";
import { LoginInput } from "./dto/login.dto";
import { VerifyInput } from "./dto/verify.dto";
import { ResendInput } from "./dto/resend.dto";
import { StudentLoginInput } from "./dto/student-login.dto";
import { ProfileInput } from "./dto/profile.dto";
import { UserSearchInput } from "./dto/search.dto";

//Entity
import { SuccessInfo } from "./entities/success.entity";
import { User } from "./entities/user.entity";

//Auth guards
import { AuthGuard } from "@/auth/auth.guard";
import { RolesGuard } from "@/auth/roles.guard";
import { Role } from "@/auth/enum/auth.enum";
import { Roles } from "@/auth/decorator/auth.decorator";

//Req user
import { ReqUser } from "@/auth/Types/user.types";

@Resolver()
export class UserResolver {
    //Constructor
    constructor(
        private readonly userService: UserService
    ) { };

    //Get users list
    @Query(() => User, { name: "getProfile" })
    @UseGuards(AuthGuard)
    profile(
        @Context("user") reqUser: ReqUser
    ) {
        return this.userService.profile(reqUser)
    };

    //Registration
    @Mutation(() => SuccessInfo, { name: "registration" })
    registration(
        @Args("registrationInput") registrationInput: RegistrationInput
    ) {
        return this.userService.registration(registrationInput);
    }

    //Login
    @Mutation(() => SuccessInfo, { name: "login" })
    login(
        @Args("loginInput") loginInput: LoginInput
    ) {
        return this.userService.login(loginInput);
    };

    //Student login
    @Mutation(() => SuccessInfo, { name: "studentLogin" })
    studentLogin(
        @Args("studentLoginInput") studentLoginInput: StudentLoginInput,
        @Context("req") req: Request
    ) {
        return this.userService.studentLogin(studentLoginInput, req);
    };

    //Parent Login
    @Mutation(() => SuccessInfo, { name: "parentLogin" })
    parentLogin(
        @Args("loginInput") loginInput: LoginInput
    ) {
        return this.userService.parentLogin(loginInput);
    };

    //Resend code
    @Mutation(() => SuccessInfo, { name: "resendCode" })
    resend(
        @Args("resendInput") resendInput: ResendInput
    ) {
        return this.userService.resend(resendInput);
    };

    //Verify
    @Mutation(() => SuccessInfo, { name: "verify" })
    async verify(
        @Args("verifyInput") verifyInput: VerifyInput,
        @Context("req") req: Request
    ) {
        return await this.userService.verify(verifyInput, req);
    };

    //Update profile
    @Mutation(() => SuccessInfo, { name: "updateProfile" })
    @UseGuards(AuthGuard)
    update(
        @Args("profileInput") profileInput: ProfileInput,
        @Context("user") reqUser: ReqUser
    ) {
        return this.userService.update(profileInput, reqUser);
    };

    //Search Profile
    @Mutation(() => User, { name: "searchProfile" })
    @Roles(Role.ACCOUNTANT, Role.PRINCIPAL)
    @UseGuards(AuthGuard, RolesGuard)
    search(
        @Args("userSearchInput") userSearchInput: UserSearchInput
    ) {
        return this.userService.search(userSearchInput);
    };

    //Logout
    @Mutation(() => SuccessInfo, { name: "logout" })
    @UseGuards(AuthGuard)
    logout(
        @Context("req") req: Request
    ) {
        return this.userService.logout(req);
    };
}