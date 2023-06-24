import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { paginate, PaginationTypeEnum } from "nestjs-typeorm-paginate";

//Orm Entity
import { Subject } from "./model/subject.entity";

//Dto
import { SubjectInput } from "./dto/subject.dto";
import { SearchInput } from "@/section/dto/search.dto";

//Req user
import { ReqUser } from "@/auth/Types/user.types";

@Injectable()
export class SubjectService {
    //Constructor
    constructor(
        @InjectRepository(Subject) private subjectRepository: Repository<Subject>
    ) { };

    //Get Subject list
    async gets(searchInput: SearchInput) {
        const subjects = await this.subjectRepository
            .createQueryBuilder("subject")
            .leftJoinAndSelect("subject.createdBy", "createdBy")
            .orderBy("subject.created_at", searchInput.orderBy ?? "DESC")

        if (searchInput.search) {
            subjects.where("LOWER(subject.name) LIKE :search", { search: `%${searchInput.search.toLowerCase()}%` })
        }
        const { items, meta } = await paginate<Subject>(subjects, {
            page: searchInput.page,
            limit: searchInput.limit,
            paginationType: PaginationTypeEnum.TAKE_AND_SKIP
        });
        return {
            results: items,
            meta
        }
    };

    //Get Subject list without pagination
    async getAll() {
        const subjects = await this.subjectRepository.find({
            relations: {
                createdBy: true
            },
            order: {
                created_at: "DESC"
            }
        });
        return subjects;
    }

    //Create Subject
    async create(subjectInput: SubjectInput, reqUser: ReqUser) {
        const subject = await this.subjectRepository.findOneBy({
            name: subjectInput.name.trim()
        });
        if (subject) throw new NotFoundException("Subject name already exist!");
        const newSubject = this.subjectRepository.create({
            ...subjectInput,
            name: subjectInput.name.trim(),
            createdBy: { id: reqUser.id }
        });
        await this.subjectRepository.save(newSubject);
        return {
            success: true,
            message: "Subject created successfully!"
        }
    };

    //Update Subject
    async update(subjectInput: SubjectInput, id: string, reqUser: ReqUser) {
        const subject = await this.subjectRepository.findOneBy({
            id: id
        });
        if (!subject) throw new NotFoundException("Subject not found!");
        if (subject.name !== subjectInput.name.trim()) {
            const exist = await this.subjectRepository.findOneBy({
                name: subjectInput.name.trim()
            });
            if (exist) throw new NotFoundException("Subject name already exists!");
        }
        await this.subjectRepository.update(id, {
            ...subjectInput,
            name: subjectInput.name.trim(),
            createdBy: { id: reqUser.id }
        });
        return {
            success: true,
            message: "Subject updated successfully!"
        }
    }

    //Delete Subject
    async delete(id: string) {
        try {
            const result = await this.subjectRepository.delete(id);
            if (result.affected === 0) throw new NotFoundException("Subject not found!");
        } catch {
            throw new NotFoundException("Cannot delete subject because it has related record!");
        }
        return {
            success: true,
            message: "Subject deleted successfully!"
        }
    };
}