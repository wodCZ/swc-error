import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

//Entities
import { User } from "@/user/model/user.entity";
import { Session } from "@/user/model/session.entity";
import { Student } from "@/student/model/student.entity";

@Injectable()
export class EventService {
    //Constructor
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Session) private sessionRepository: Repository<Session>,
        @InjectRepository(Student) private studentRepository: Repository<Student>,
        private readonly jwtService: JwtService
    ) { };

    //Onconnect
    async onConnect(extra: any) {
        const { request }: { request: Request } = extra;
        const cookieHeader = request.headers.cookie;
        const cookies = await this.cookieParser(cookieHeader);
        if (!cookies["9717f25d01fb469d5d6a3c6c70e1919aebec"]) {
            return false
        }
        return extra.user = await this.validToken(cookies["9717f25d01fb469d5d6a3c6c70e1919aebec"], request.headers["user-agent"], request.socket.remoteAddress);
    };

    //On Disconnect
    async onDisconnect(extra) {
        //Function for on Disconnection
    }

    private async validToken(cookie: string, agent: string, ip: string) {
        try {
            const decode = this.jwtService.verify(cookie);
            const user = await this.userRepository.findOne({
                where: [
                    { id: decode.id, phone: decode.phone },
                    { id: decode.id, studentId: decode.studentId }
                ]
            });
            if (!user) return false;
            const session = await this.sessionRepository.findOneBy({
                cookie: cookie
            });
            if (!session) return false
            let student;
            if (user.role === "student") {
                student = await this.studentRepository.findOne({
                    where: {
                        accountId: { id: user.id }
                    },
                    relations: {
                        class: true
                    }
                });
            }
            // const isSession = checkSession(session, ip, agent);
            // if (!isSession) throw new HttpException("Unauthorized Request", HttpStatus.UNAUTHORIZED);
            return { ...user, classId: student?.class?.id || null };
        } catch (err) {
            return false;
        }
    }

    //Cookie Parser
    private async cookieParser(cookieHeader: string): Promise<{ [key: string]: string }> {
        const cookies: { [key: string]: string } = {};
        if (cookieHeader) {
            const cookiePairs = cookieHeader.split(';');
            for (const cookiePair of cookiePairs) {
                const [name, value] = cookiePair.split('=').map((part) => part.trim());
                cookies[name] = value;
            }
        }
        return cookies;
    }
}