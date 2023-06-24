import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In } from "typeorm";
import { paginate, PaginationTypeEnum } from "nestjs-typeorm-paginate";

//Orm Entity
import { Class } from "./model/class.entity";
import { Section } from "@/section/model/section.entity";
import { Group } from "@/group/model/group.entity";
import { Shift } from "@/shift/model/shift.entity";

//Dto
import { ClassInput } from "./dto/class.dto";
import { SearchInput } from "@/section/dto/search.dto";

//Req user
import { ReqUser } from "@/auth/Types/user.types";

@Injectable()
export class ClassService {
    //Constructor
    constructor(
        @InjectRepository(Class) private classRepository: Repository<Class>,
        @InjectRepository(Section) private sectionRepository: Repository<Section>,
        @InjectRepository(Group) private groupRepository: Repository<Group>,
        @InjectRepository(Shift) private shiftRepository: Repository<Shift>
    ) { };

    //Gets Class list with pagination
    async gets(searchInput: SearchInput) {
        const classes = await this.classRepository
            .createQueryBuilder("class")
            .leftJoinAndSelect("class.section", "section")
            .leftJoinAndSelect("class.group", "group")
            .leftJoinAndSelect("class.shift", "shift")
            .leftJoinAndSelect("class.createdBy", "createdBy")
            .orderBy("class.created_at", searchInput.orderBy ?? "DESC")

        if (searchInput.search) {
            classes.where("LOWER(class.name) LIKE :search", { search: `%${searchInput.search.toLowerCase()}%` })
        }

        const { items, meta } = await paginate<Class>(classes, {
            page: searchInput.page,
            limit: searchInput.limit,
            paginationType: PaginationTypeEnum.TAKE_AND_SKIP
        });
        return {
            results: items,
            meta
        }
    };

    //Get Class List without pagination
    async getAll() {
        const classes = await this.classRepository.find({
            relations: {
                section: true,
                group: true,
                shift: true,
                createdBy: true
            },
            order: {
                created_at: "DESC"
            }
        })
        return classes;
    }

    //Create Class
    async create(classInput: ClassInput, reqUser: ReqUser) {
        const classes = await this.classRepository.findOneBy({
            name: classInput.name.trim()
        });
        if (classes) throw new NotFoundException("Class name already exist!");
        const sections = await this.sectionRepository.findBy({
            id: In(classInput.section)
        });
        const groups = await this.groupRepository.findBy({
            id: In(classInput.group)
        });
        const shift = await this.shiftRepository.findBy({
            id: In(classInput.shift)
        })
        const newClass = this.classRepository.create({
            name: classInput.name.trim(),
            section: sections,
            group: groups,
            shift: shift,
            createdBy: { id: reqUser.id }
        })
        await this.classRepository.save(newClass);
        return {
            success: true,
            message: "Class Created Successfully!"
        }
    };

    //Update Class
    async update(classInput: ClassInput, id: string, reqUser: ReqUser) {
        const classId = await this.classRepository.findOne({
            where: {
                id: id
            },
            relations: {
                createdBy: true
            }
        });
        if (!classId) throw new NotFoundException("Class not found!");
        if (classId.name !== classInput.name.trim()) {
            const exist = await this.classRepository.findOneBy({
                name: classInput.name.trim()
            });
            if (exist) throw new NotFoundException("Class name already exist!");
        }
        const sections = await this.sectionRepository.findBy({
            id: In(classInput.section)
        });
        const groups = await this.groupRepository.findBy({
            id: In(classInput.group)
        });
        const shift = await this.shiftRepository.findBy({
            id: In(classInput.shift)
        })
        classId.name = classInput.name.trim();
        classId.section = sections;
        classId.group = groups;
        classId.shift = shift;
        classId.createdBy.id = reqUser.id
        await this.classRepository.save(classId);
        return {
            success: true,
            message: "Class updated successfully!"
        }
    }

    //Delete class
    async delete(id: string) {
        try {
            const result = await this.classRepository.delete(id);
            if (result.affected === 0) throw new NotFoundException("Class not found!");
        } catch {
            throw new NotFoundException("Cannot delete class because it has related record!")
        }
        return {
            success: true,
            message: "Class deleted successfully!"
        }
    };
}