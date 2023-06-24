import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { paginate, PaginationTypeEnum } from "nestjs-typeorm-paginate";

//Orm Entity
import { Section } from "./model/section.entity";

//Entities
import { SuccessInfo } from "@/user/entities/success.entity";

//Dto
import { SectionInput } from "./dto/section.dto";
import { SearchInput } from "./dto/search.dto";

//Req user
import { ReqUser } from "@/auth/Types/user.types";

@Injectable()
export class SectionService {
    //Constructor
    constructor(
        @InjectRepository(Section) private sectionRepository: Repository<Section>
    ) { }

    //Get Sections List With Pagination
    async gets(searchInput: SearchInput) {
        const sections = await this.sectionRepository
            .createQueryBuilder("section")
            .leftJoinAndSelect("section.createdBy", "createdBy")
            .orderBy("section.created_at", searchInput.orderBy ?? "DESC")

        if (searchInput.search) {
            sections.where("LOWER(section.name) LIKE :search", { search: `%${searchInput.search.toLowerCase()}%` })
        }

        const { items, meta } = await paginate<Section>(sections, {
            page: searchInput.page,
            limit: searchInput.limit,
            paginationType: PaginationTypeEnum.TAKE_AND_SKIP
        });
        return {
            results: items,
            meta
        }
    };

    //Get Section List Without Pagination
    async getAll() {
        const sections = await this.sectionRepository.find({
            relations: {
                createdBy: true
            },
            order: {
                created_at: "DESC"
            }
        });
        return sections;
    }

    //Create sections
    async create(sectionInput: SectionInput, reqUser: ReqUser): Promise<SuccessInfo> {
        const section = await this.sectionRepository.findOneBy({
            name: sectionInput.name.trim()
        });
        if (section) throw new NotFoundException("Section name exits!");
        const newSection = this.sectionRepository.create({
            name: sectionInput.name.trim(),
            createdBy: { id: reqUser.id }
        });
        await this.sectionRepository.save(newSection);
        return {
            success: true,
            message: "Section added successfully!"
        }
    };

    //Update Section
    async update(sectionInput: SectionInput, id: string, reqUser: ReqUser) {
        const section = await this.sectionRepository.findOneBy({
            id: id
        });
        if (!section) throw new NotFoundException("Section not found!");
        if (section.name !== sectionInput.name.trim()) {
            const exist = await this.sectionRepository.findOneBy({
                name: sectionInput.name.trim()
            });
            if (exist) throw new NotFoundException("Section not found!");
        }
        await this.sectionRepository.update(id, {
            name: sectionInput.name.trim(),
            createdBy: { id: reqUser.id }
        })
        return {
            success: true,
            message: "Section updated successfully!"
        }
    };


    //Delete Sections
    async delete(id: string) {
        try {
            const result = await this.sectionRepository.delete(id);
            if (result.affected === 0) throw new NotFoundException("Section not found!");
        } catch {
            throw new NotFoundException("Cannot delete section because it has related record!");
        }
        return {
            success: true,
            message: "Section Deleted Successfully!"
        }
    };
}