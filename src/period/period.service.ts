import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { paginate, PaginationTypeEnum } from "nestjs-typeorm-paginate";

//Orm entity
import { Period } from "./model/period.entity";

//Dto
import { PeriodInput } from "./dto/period.dto";
import { SearchInput } from "@/section/dto/search.dto";

//Req user
import { ReqUser } from "@/auth/Types/user.types";

@Injectable()
export class PeriodService {
    //constructor
    constructor(
        @InjectRepository(Period) private periodRepository: Repository<Period>
    ) { };

    //Get period list with pagination
    async gets(searchInput: SearchInput) {
        const periods = await this.periodRepository
            .createQueryBuilder("period")
            .leftJoinAndSelect("period.createdBy", "createdBy")
            .leftJoinAndSelect("period.shift", "shift")
            .orderBy("period.created_at", searchInput.orderBy ?? "DESC")

        if (searchInput.search) {
            periods.where("LOWER(period.name) LIKE :search", { search: `%${searchInput.search.toLowerCase()}%` })
        }

        const { items, meta } = await paginate<Period>(periods, {
            page: searchInput.page,
            limit: searchInput.limit,
            paginationType: PaginationTypeEnum.TAKE_AND_SKIP
        });
        return {
            results: items,
            meta
        }
    };

    //Get period list with pagination
    async getAll() {
        const periods = await this.periodRepository.find({
            relations: {
                shift: true,
                createdBy: true
            },
            order: {
                created_at: "DESC"
            }
        });
        return periods;
    }

    //Create period
    async create(periodInput: PeriodInput, reqUser: ReqUser) {
        const period = await this.periodRepository.findOneBy({
            name: periodInput.name.trim(),
            shift: { id: periodInput.shift }
        });
        if (period) throw new NotFoundException("Period already added!");
        const newPeriod = this.periodRepository.create({
            ...periodInput,
            name: periodInput.name.trim(),
            shift: { id: periodInput.shift },
            createdBy: { id: reqUser.id }
        });
        await this.periodRepository.save(newPeriod);
        return {
            success: true,
            message: "Period added successfully!"
        }
    };

    //Update period
    async update(periodInput: PeriodInput, id: string, reqUser: ReqUser) {
        const period = await this.periodRepository.findOneBy({
            id: id
        })
        if (!period) throw new NotFoundException("Period not found!");
        if (period.name !== periodInput.name.trim()) {
            const exist = await this.periodRepository.findOneBy({
                name: periodInput.name.trim()
            })
        };
        await this.periodRepository.update(id, {
            ...periodInput,
            name: periodInput.name.trim(),
            shift: { id: periodInput.shift },
            createdBy: { id: reqUser.id }
        });
        return {
            success: true,
            message: "Period updated successfully!"
        }
    }

    //Delete Period
    async delete(id: string) {
        try {
            const result = await this.periodRepository.delete(id);
            if (result.affected === 0) throw new NotFoundException("Period not found!");
        } catch {
            throw new NotFoundException("Cannot delete period because it has related record!s");
        };
        return {
            success: true,
            message: "Period deleted successfully!"
        }
    };
}