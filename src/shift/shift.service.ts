import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Raw } from "typeorm";
import { paginate, PaginationTypeEnum } from "nestjs-typeorm-paginate";

//Entity
import { Shift } from "./model/shift.entity";

//Dto
import { ShiftInput } from "./dto/shift.dto";
import { SearchInput } from "@/section/dto/search.dto";

//Req user
import { ReqUser } from "@/auth/Types/user.types";

@Injectable()
export class ShiftService {
    //Constructor
    constructor(
        @InjectRepository(Shift) private shiftRepository: Repository<Shift>
    ) { };

    //Get shifts with pagination
    async gets(searchInput: SearchInput) {
        const shifts = await this.shiftRepository
            .createQueryBuilder("shift")
            .leftJoinAndSelect("shift.createdBy", "createdBy")
            .orderBy("shift.created_at", searchInput.orderBy ?? "DESC")

        if (searchInput.search) {
            shifts.where("LOWER(shift.name) LIKE :search", { search: `%${searchInput.search.toLowerCase()}%` })
        }

        const { items, meta } = await paginate<Shift>(shifts, {
            page: searchInput.page,
            limit: searchInput.limit,
            paginationType: PaginationTypeEnum.TAKE_AND_SKIP
        });
        return {
            results: items,
            meta
        }
    };

    //Get shift without pagination
    async getAll() {
        const shift = await this.shiftRepository.find({
            relations: {
                createdBy: true
            },
            order: {
                created_at: "DESC"
            }
        });
        return shift;
    }

    //Add shift
    async create(shiftInput: ShiftInput, reqUser: ReqUser) {
        const shift = await this.shiftRepository.findOneBy({
            name: shiftInput.name.trim()
        });
        if (shift) throw new NotFoundException("Shift name exits!");
        const newSection = this.shiftRepository.create({
            name: shiftInput.name.trim(),
            createdBy: { id: reqUser.id }
        });
        await this.shiftRepository.save(newSection);
        return {
            success: true,
            message: "Shift added successfully!"
        }
    };

    //Update Shift
    async update(shiftInput: ShiftInput, id: string, reqUser: ReqUser) {
        const shift = await this.shiftRepository.findOneBy({
            id: id
        })
        if (!shift) throw new NotFoundException("Shift not found!");
        if (shift.name !== shiftInput.name.trim()) {
            const exist = await this.shiftRepository.findOneBy({
                name: shiftInput.name.trim()
            });
            if (exist) throw new NotFoundException("Shift name already exists!");
        }
        await this.shiftRepository.update(id, {
            name: shiftInput.name.trim(),
            createdBy: { id: reqUser.id }
        });
        return {
            success: true,
            message: "Shift updated successfully!"
        }
    };

    //Delete Shift
    async delete(id: string) {
        try {
            const result = await this.shiftRepository.delete(id);
            if (result.affected === 0) throw new NotFoundException("Shift not found!");
        } catch {
            throw new NotFoundException("Cannot delete shift because it has related record!");
        }
        return {
            success: true,
            message: "Shift deleted successfully!"
        }
    };
}