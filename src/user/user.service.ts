import { Injectable, NotFoundException } from "@nestjs/common";
import { Request } from "express";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import * as speakeasy from "speakeasy";
import * as geoip from "geoip-lite";
import { parse } from "next-useragent";
import { HttpService } from "@nestjs/axios";
import { AxiosError } from "axios";
import { catchError, firstValueFrom } from "rxjs";
import * as bcrypt from "bcrypt";

//Helper Function
import { sentSms } from "@/helper/sms.helper";

//Orm Entity
import { User } from "./model/user.entity";
import { Session } from "./model/session.entity";

//Dto
import { RegistrationInput } from "./dto/registration.dto";
import { LoginInput } from "./dto/login.dto";
import { VerifyInput } from "./dto/verify.dto";
import { ResendInput } from "./dto/resend.dto";
import { StudentLoginInput } from "./dto/student-login.dto";
import { ProfileInput } from "./dto/profile.dto";
import { UserSearchInput } from "./dto/search.dto";

//Entities
import { SuccessInfo } from "./entities/success.entity";

//ReqUser
import { ReqUser } from "@/auth/Types/user.types";

@Injectable()
export class UserService {
    //Constructor
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Session) private sessionRepository: Repository<Session>,
        private readonly jwtService: JwtService,
        private readonly httpService: HttpService
    ) { };

    //Get users
    async profile(reqUser: ReqUser) {
        const profile = await this.userRepository.findOneBy({
            id: reqUser.id
        });
        if (!profile) throw new NotFoundException("Profile not found!");
        return profile;
    };

    //Registration User
    async registration(registrationInput: RegistrationInput) {
        const user = await this.userRepository.findOneBy({
            phone: registrationInput.phone
        });
        if (user) throw new NotFoundException("User already exist!");
        const newUser = await this.userRepository.create({
            name: registrationInput.name,
            phone: registrationInput.phone,
            role: "principal",
            is_verify: false
        })
        await this.userRepository.save(newUser);
        return {
            success: true,
            message: "We will verify your account soon and set confirmation message to your phone!"
        }
    };

    //Login users
    async login(loginInput: LoginInput): Promise<SuccessInfo> {
        const user = await this.userRepository.findOneBy({
            phone: loginInput.phone,
            role: In(["principal", "accountant", "teacher"]),
            is_verify: true,
        });
        if (!user) throw new NotFoundException("Please register your accountss!");
        const secret = speakeasy.generateSecret({ length: 20 });
        const otp = speakeasy.totp({
            secret: secret.base32,
            encoding: 'base32'
        });
        // const smsData = await sentSms(loginInput.phone, `Your e-campus login code is ${otp}. Please do not share this code anyone. Code expires in 5 minutes!`);
        // const { data } = await firstValueFrom(
        //     this.httpService.post("http://api.greenweb.com.bd/api.php", smsData).pipe(
        //         catchError((error: AxiosError) => {
        //             throw new NotFoundException("Something Went Wrong!")
        //         })
        //     )
        // );
        // if (!data.toString().includes("Ok:")) throw new NotFoundException(data.toString());
        console.log(otp);
        await this.userRepository.update(user.id, { otp: secret.base32 });
        return {
            message: "Verification code sent successfully!",
            success: true
        }
    };

    //Student Login
    async studentLogin(studentLoginInput: StudentLoginInput, req: Request) {
        const student = await this.userRepository.findOne({
            where: {
                studentId: studentLoginInput.studentId,
            },
            select: ["id", "password", "studentId"]
        })
        if (!student) throw new NotFoundException("Wrong password or id");
        const isMatch = await bcrypt.compare(studentLoginInput.password, student.password);
        if (!isMatch) throw new NotFoundException("Wrong password or id");
        const token = this.jwtService.sign({ studentId: student.studentId, id: student.id });
        const agent = parse(req.headers['user-agent']);
        const geo = geoip.lookup(req.ip);
        const session = await this.sessionRepository.create({
            cookie: token,
            browser: agent.browser,
            os: agent.os,
            osVersion: agent.osVersion.toString(),
            device: agent.deviceType,
            area: geo?.city,
            user: { id: student.id }
        })
        await this.sessionRepository.save(session);
        req.res.cookie("9717f25d01fb469d5d6a3c6c70e1919aebec", token, {
            maxAge: 90 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });
        return {
            success: true,
            message: "Login successful!"
        }
    };

    //Login parents
    async parentLogin(loginInput) {
        const user = await this.userRepository.findOneBy({
            phone: loginInput.phone,
            role: "parents",
            is_verify: true,
        });
        if (!user) throw new NotFoundException("You don't have permission to login!");
        const secret = speakeasy.generateSecret({ length: 20 });
        const otp = speakeasy.totp({
            secret: secret.base32,
            encoding: 'base32'
        });
        // const smsData = await sentSms(loginInput.phone, `Your e-campus login code is ${otp}. Please do not share this code anyone. Code expires in 5 minutes!`);
        // const { data } = await firstValueFrom(
        //     this.httpService.post("http://api.greenweb.com.bd/api.php", smsData).pipe(
        //         catchError((error: AxiosError) => {
        //             throw new NotFoundException("Something Went Wrong!")
        //         })
        //     )
        // );
        // if (!data.toString().includes("Ok:")) throw new NotFoundException(data.toString());
        console.log(otp);
        await this.userRepository.update(user.id, { otp: secret.base32 });

        return {
            message: "Verification code sent successfully!",
            success: true
        }
    };

    //Resend phone number
    async resend(resendInput: ResendInput) {
        const user = await this.userRepository.findOneBy({
            phone: resendInput.phone
        });
        if (!user) throw new NotFoundException("User not found!");
        const secret = speakeasy.generateSecret({ length: 20 });
        const otp = speakeasy.totp({
            secret: secret.base32,
            encoding: 'base32'
        });
        // const smsData = await sentSms(loginInput.phone, `Your e-campus login code is ${otp}. Please do not share this code anyone. Code expires in 5 minutes!`);
        // const { data } = await firstValueFrom(
        //     this.httpService.post("http://api.greenweb.com.bd/api.php", smsData).pipe(
        //         catchError((error: AxiosError) => {
        //             throw new NotFoundException("Something Went Wrong!")
        //         })
        //     )
        // );
        // if (!data.toString().includes("Ok:")) throw new NotFoundException(data.toString());
        console.log(otp);
        await this.userRepository.update(user.id, { otp: secret.base32 });
        return {
            success: true,
            message: "Code sent successfully!"
        }
    };

    //Verify phone number
    async verify(verifyInput: VerifyInput, req: Request) {
        const user = await this.userRepository.findOne({
            where: {
                phone: verifyInput.phone
            },
            select: ["id", "phone", "otp"]
        })
        if (!user) throw new NotFoundException("User not found!");
        var validOtp = speakeasy.totp.verify({
            secret: user.otp,
            encoding: 'base32',
            token: verifyInput.otp,
            window: 10
        });
        if (!validOtp) throw new NotFoundException("Wrong or expired otp!");
        const token = this.jwtService.sign({ phone: user.phone, id: user.id })
        await this.userRepository.update(user.id, { is_verify: true, otp: "" });
        const agent = parse(req.headers['user-agent']);
        const geo = geoip.lookup(req.ip);
        const session = await this.sessionRepository.create({
            cookie: token,
            browser: agent.browser,
            os: agent.os,
            osVersion: agent.osVersion.toString(),
            device: agent.deviceType,
            area: geo?.city,
            user: { id: user.id }
        })
        await this.sessionRepository.save(session);
        req.res.cookie("9717f25d01fb469d5d6a3c6c70e1919aebec", token, {
            maxAge: 90 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/"
        });
        return {
            message: "User verified successfully!",
            success: true
        }
    };

    //Update profile
    async update(profileInput: ProfileInput, reqUser: ReqUser) {
        const result = await this.userRepository.update(reqUser.id, {
            name: profileInput.name,
            image: profileInput.image
        });
        if (result.affected === 0) throw new NotFoundException("Profile not found!");
        return {
            success: true,
            message: "Profile updated successfully!"
        }
    };

    //User search
    async search(userSearchInput: UserSearchInput) {
        const user = await this.userRepository.findOne({
            where: [
                { studentId: userSearchInput.idOrPhone },
                { phone: "88" + userSearchInput.idOrPhone }
            ]
        });
        if (!user) throw new NotFoundException("User not found!");
        return user;
    };

    //Logout
    async logout(req: Request) {
        const cookie = req.cookies["9717f25d01fb469d5d6a3c6c70e1919aebec"];
        await this.sessionRepository.delete({ cookie });
        req.res.clearCookie("9717f25d01fb469d5d6a3c6c70e1919aebec", {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });
        return {
            success: true,
            message: "User Logout Successfully!"
        }
    }
}