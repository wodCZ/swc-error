import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { paginate, PaginationTypeEnum } from "nestjs-typeorm-paginate";

//Entities
import { IncomeHead } from "./model/income-head.entity";
import { Income } from "./model/income.entity";

//Dto
import { IncomeHeadInput } from "./dto/income-head.dto";
import { SearchInput } from "@/section/dto/search.dto";
import { IncomeInput } from "./dto/income.dto";

//Req user
import { ReqUser } from "@/auth/Types/user.types";

@Injectable()
export class IncomeService {
    //Constructor
    constructor(
        @InjectRepository(IncomeHead) private headRepository: Repository<IncomeHead>,
        @InjectRepository(Income) private incomeRepository: Repository<Income>
    ) { };

    //-----------------------------------Head------------------------------------//

    //Get all income Head with pagination
    async getHeads(searchInput: SearchInput) {
        const heads = await this.headRepository
            .createQueryBuilder("head")
            .leftJoinAndSelect("head.createdBy", "createdBy")
            .orderBy("head.created_at", searchInput.orderBy ?? "DESC")

        if (searchInput.search) {
            heads.where("LOWER(head.name) LIKE :search", { search: `%${searchInput.search.toLowerCase()}%` })
        }

        const { items, meta } = await paginate<IncomeHead>(heads, {
            page: searchInput.page,
            limit: searchInput.limit,
            paginationType: PaginationTypeEnum.TAKE_AND_SKIP
        });
        return {
            results: items,
            meta
        }
    };

    //Get all income Head without pagination
    async getAllHead() {
        const heads = await this.headRepository.find({
            relations: {
                createdBy: true
            },
            order: {
                created_at: "DESC"
            }
        });
        return heads;
    }

    //Add Income Head
    async addHead(incomeHeadInput: IncomeHeadInput, reqUser: ReqUser) {
        const head = await this.headRepository.findOneBy({
            title: incomeHeadInput.title
        });
        if (head) throw new NotFoundException("Income Head Already Added!");
        const newHead = this.headRepository.create({
            ...incomeHeadInput,
            createdBy: { id: reqUser.id }
        });
        await this.headRepository.save(newHead);
        return {
            success: true,
            message: "Income Head Added Successfully!"
        }
    };

    //Update Income Head
    async updateHead(incomeHeadInput: IncomeHeadInput, id: string, reqUser: ReqUser) {
        const head = await this.headRepository.findOneBy({
            id: id
        });
        if (!head) throw new NotFoundException("Income head not found!");
        if (head.title !== incomeHeadInput.title) {
            const exist = await this.headRepository.findOneBy({
                title: incomeHeadInput.title
            });
            if (exist) throw new NotFoundException("Please try different title!");
        };
        await this.headRepository.update(id, {
            ...incomeHeadInput,
            createdBy: { id: reqUser.id }
        });
        return {
            success: true,
            message: "Income Head Updated Successfully!"
        }
    };

    //Delete Income Head
    async deleteHead(id: string) {
        try {
            const result = await this.headRepository.delete(id);
            if (result.affected === 0) throw new NotFoundException("Income head not found!");
        } catch {
            throw new NotFoundException("Cannot delete income head because it has related record!")
        }
        return {
            success: true,
            message: "Income Head delete successfully!"
        }
    };


    //----------------------------------Income-----------------------------------//

    //Get All incomes with pagination
    async getIncomes(searchInput: SearchInput) {
        const incomes = await this.incomeRepository
            .createQueryBuilder("income")
            .leftJoinAndSelect("income.createdBy", "createdBy")
            .leftJoinAndSelect("income.head", "head")
            .orderBy("income.created_at", searchInput.orderBy ?? "DESC")

        if (searchInput.search) {
            incomes.where("LOWER(income.name) LIKE :search", { search: `%${searchInput.search.toLowerCase()}%` })
        }
        const { items, meta } = await paginate<Income>(incomes, {
            page: searchInput.page,
            limit: searchInput.limit,
            paginationType: PaginationTypeEnum.TAKE_AND_SKIP
        });
        return {
            results: items,
            meta
        }
    };

    //Get All incomes with pagination
    async getAllIncome() {
        const incomes = await this.incomeRepository.find({
            relations: {
                createdBy: true,
                head: true
            },
            order: {
                created_at: "DESC"
            }
        });
        return incomes;
    };

    //Add income
    async addIncome(incomeInput: IncomeInput, reqUser: ReqUser) {
        const income = this.incomeRepository.create({
            ...incomeInput,
            head: { id: incomeInput.head },
            createdBy: { id: reqUser.id }
        });
        await this.incomeRepository.save(income);
        return {
            success: true,
            message: "Income Added Successfully!"
        }
    };

    //Update Income
    async updateIncome(incomeInput: IncomeInput, id: string, reqUser: ReqUser) {
        const result = await this.incomeRepository.update(id, {
            ...incomeInput,
            head: { id: incomeInput.head },
            createdBy: { id: reqUser.id }
        });
        if (result.affected === 0) throw new NotFoundException("Income not found!");
        return {
            success: true,
            message: "Income updated successfully!"
        };
    };

    //Delete Income
    async deleteIncome(id: string) {
        try {
            const result = await this.incomeRepository.delete(id);
            if (result.affected === 0) throw new NotFoundException("Income not found!");
        } catch {
            throw new NotFoundException("Cannot delete income because it has related record!")
        }
        return {
            success: true,
            message: "Income delete successfully!"
        }
    };
}