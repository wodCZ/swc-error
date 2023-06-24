import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { paginate, PaginationTypeEnum } from "nestjs-typeorm-paginate";

//Orm Entity
import { Group } from "./model/group.entity";

//Dto
import { GroupInput } from "./dto/group.dto";
import { SearchInput } from "@/section/dto/search.dto";

//Types
import { ReqUser } from "@/auth/Types/user.types";

@Injectable()
export class GroupService {
    //Constructor
    constructor(
        @InjectRepository(Group) private groupRepository: Repository<Group>
    ) { }

    //Get groups with pagination
    async gets(searchInput: SearchInput) {
        const groups = await this.groupRepository
            .createQueryBuilder("group")
            .leftJoinAndSelect("group.createdBy", "createdBy")
            .orderBy("group.created_at", searchInput.orderBy ?? "DESC")

        if (searchInput.search) {
            groups.where("LOWER(group.name) LIKE :search", { search: `%${searchInput.search.toLowerCase()}%` })
        }

        const { items, meta } = await paginate<Group>(groups, {
            page: searchInput.page,
            limit: searchInput.limit,
            paginationType: PaginationTypeEnum.TAKE_AND_SKIP
        });
        return {
            results: items,
            meta
        }
    };

    //Get groups without pagination
    async getAll() {
        const groups = await this.groupRepository.find({
            relations: {
                createdBy: true
            },
            order: {
                created_at: "DESC"
            }
        })
        return groups
    }

    //Create group
    async create(groupInput: GroupInput, reqUser: ReqUser) {
        const group = await this.groupRepository.findOneBy({
            name: groupInput.name.trim()
        });
        if (group) throw new NotFoundException("Group name already exist!");
        const newGroup = this.groupRepository.create({
            name: groupInput.name.trim(),
            createdBy: { id: reqUser.id }
        });
        await this.groupRepository.save(newGroup);
        return {
            success: true,
            message: "Group name added successfully!"
        }
    };

    //Update Group
    async update(groupInput: GroupInput, id: string, reqUser: ReqUser) {
        const group = await this.groupRepository.findOneBy({
            id: id
        });
        if (!group) throw new NotFoundException("Group not found!");
        if (group.name !== groupInput.name.trim()) {
            const exist = await this.groupRepository.findOneBy({
                name: groupInput.name.trim()
            });
            if (exist) throw new NotFoundException("Group name already exist!");
        }
        await this.groupRepository.update(id, {
            name: groupInput.name.trim(),
            createdBy: { id: reqUser.id }
        });
        return {
            success: true,
            message: "Group updated successfully!"
        }
    };

    //Delete Group
    async delete(id: string) {
        try {
            const result = await this.groupRepository.delete(id);
            if (result.affected === 0) throw new NotFoundException("Group not found!");
        } catch {
            throw new NotFoundException("Cannot delete group because it has related record!");
        }
        return {
            success: true,
            message: "Group deleted successfully!"
        }
    };
}