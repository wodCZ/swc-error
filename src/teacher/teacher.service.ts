import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { paginate, PaginationTypeEnum } from "nestjs-typeorm-paginate";

//Orm Entity
import { Teacher } from "./model/teacher.entity";
import { User } from "@/user/model/user.entity";

//Dto
import { TeacherInput } from "./dto/teacher.dto";
import { SearchInput } from "@/section/dto/search.dto";

//Req user
import { ReqUser } from "@/auth/Types/user.types";

@Injectable()
export class TeacherService {
    //constructor
    constructor(
        @InjectRepository(Teacher) private teacherRepository: Repository<Teacher>,
        @InjectRepository(User) private userRepository: Repository<User>
    ) { };

    //Get teacher list
    async gets(searchInput: SearchInput) {
        const teachers = await this.teacherRepository
            .createQueryBuilder("teacher")
            .leftJoinAndSelect("teacher.createdBy", "createdBy")
            .orderBy("teacher.created_at", searchInput.orderBy ?? "DESC")

        if (searchInput.search) {
            teachers.where("LOWER(teacher.name) LIKE :search", { search: `%${searchInput.search.toLowerCase()}%` })
        }

        const { items, meta } = await paginate<Teacher>(teachers, {
            page: searchInput.page,
            limit: searchInput.limit,
            paginationType: PaginationTypeEnum.TAKE_AND_SKIP
        });
        return {
            results: items,
            meta
        }
    };

    //Get teacher list
    async getAll() {
        const teachers = await this.teacherRepository.find({
            relations: {
                createdBy: true
            },
            order: {
                created_at: "DESC"
            }
        });
        return teachers;
    }

    //Create Teacher
    async create(teacherInput: TeacherInput, reqUser: ReqUser) {
        const teacher = await this.teacherRepository.findOneBy({
            phone: teacherInput.phone
        });
        if (teacher) throw new NotFoundException("Teacher already added! Please try different phone number!");
        const newTeacherId = this.userRepository.create({
            name: teacherInput.name,
            phone: teacherInput.phone,
            image: teacherInput.image,
            role: "teacher",
            is_verify: true
        });
        await this.userRepository.save(newTeacherId);
        const newTeacher = this.teacherRepository.create({
            ...teacherInput,
            createdBy: { id: reqUser.id },
            accountId: { id: newTeacherId.id }
        });
        await this.teacherRepository.save(newTeacher);
        return {
            success: true,
            message: "Teacher added to list successfully!"
        }
    };

    //Update teacher
    async update(teacherInput: TeacherInput, id: string, reqUser: ReqUser) {
        const teacher = await this.teacherRepository.findOneBy({
            id: id
        });
        if (!teacher) throw new NotFoundException("Teacher not found!");
        await this.teacherRepository.save(teacher);
        await this.teacherRepository.update(id, {
            ...teacherInput,
            createdBy: { id: reqUser.id }
        });
        return {
            success: true,
            message: "Teacher updated successfully!"
        }
    };

    //Delete teacher
    async delete(id: string) {
        const teacher = await this.teacherRepository.findOneBy({
            id: id
        });
        if (!teacher) throw new NotFoundException("Teacher not found!");
        try {
            await this.teacherRepository.delete(id);
        } catch {
            throw new NotFoundException("Cannot delete teacher because it has related record!");
        }
        await this.userRepository.delete({ phone: teacher.phone })
        return {
            success: true,
            message: "Teacher deleted successfully!"
        }
    };
}