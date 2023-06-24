import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { GqlExecutionContext } from "@nestjs/graphql";
import { JwtService } from "@nestjs/jwt";

//Session Checker
import { checkSession } from "./helper/session.helper";

//User Entity
import { User } from "@/user/model/user.entity";
import { Session } from "@/user/model/session.entity";

@Injectable()
export class AuthGuard implements CanActivate {
    //Constructor
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Session) private sessionRepository: Repository<Session>,
        private readonly jwtService: JwtService
    ) { }

    //CanActivate
    async canActivate(context: ExecutionContext) {
        const ctx = GqlExecutionContext.create(context).getContext();
        if (!ctx.req?.cookies?.["9717f25d01fb469d5d6a3c6c70e1919aebec"]) {
            return false
        }
        ctx.user = await this.validToken(ctx.req?.cookies?.["9717f25d01fb469d5d6a3c6c70e1919aebec"], ctx.req.headers['user-agent'], ctx.req.ip);
        return true;
    }
    //Valid token
    async validToken(cookie: string, agent: string, ip: string) {
        try {
            const decode = this.jwtService.verify(cookie);
            const user = await this.userRepository.findOne({
                where: [
                    { id: decode.id, phone: decode.phone },
                    { id: decode.id, studentId: decode.studentId }
                ]
            });
            if (!user) throw new HttpException("Unauthorized Request", HttpStatus.UNAUTHORIZED);
            const session = await this.sessionRepository.findOneBy({
                cookie: cookie
            });
            if (!session) throw new HttpException("Unauthorized Request", HttpStatus.UNAUTHORIZED);
            // const isSession = checkSession(session, ip, agent);
            // if (!isSession) throw new HttpException("Unauthorized Request", HttpStatus.UNAUTHORIZED);
            return user;
        } catch (err) {
            throw new HttpException("Unauthorized Request", HttpStatus.UNAUTHORIZED);
        }
    }
}