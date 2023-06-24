import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { paginate, PaginationTypeEnum } from "nestjs-typeorm-paginate";

//Entities
import { Expense } from "./model/expense.entity";
import { ExpenseHead } from "./model/expense-head.entity";

//Dto
import { ExpenseHeadInput } from "./dto/expense-head.dto";
import { SearchInput } from "@/section/dto/search.dto";
import { ExpenseInput } from "./dto/expense.dto";

//Req user
import { ReqUser } from "@/auth/Types/user.types";

@Injectable()
export class ExpenseService {
    //Constructor
    constructor(
        @InjectRepository(ExpenseHead) private headRepository: Repository<ExpenseHead>,
        @InjectRepository(Expense) private expenseRepository: Repository<Expense>
    ) { };

    //-------------------------------------Head--------------------------------------//
    //Get all expense head without pagination
    async getHeads(searchInput: SearchInput) {
        const heads = await this.headRepository
            .createQueryBuilder("head")
            .leftJoinAndSelect("head.createdBy", "createdBy")
            .orderBy("head.created_at", searchInput.orderBy ?? "DESC")

        if (searchInput.search) {
            heads.where("LOWER(head.name) LIKE :search", { search: `%${searchInput.search.toLowerCase()}%` })
        }

        const { items, meta } = await paginate<ExpenseHead>(heads, {
            page: searchInput.page,
            limit: searchInput.limit,
            paginationType: PaginationTypeEnum.TAKE_AND_SKIP
        });
        return {
            results: items,
            meta
        }
    };

    //Get all expense head with pagination
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
    };

    //Add Expense Head
    async addHead(expenseHeadInput: ExpenseHeadInput, reqUser: ReqUser) {
        const head = await this.headRepository.findOneBy({
            title: expenseHeadInput.title
        });
        if (head) throw new NotFoundException("Expense Head Already Added!");
        const newHead = this.headRepository.create({
            ...expenseHeadInput,
            createdBy: { id: reqUser.id }
        });
        await this.headRepository.save(newHead);
        return {
            success: true,
            message: "Expense Head Added Successfully!"
        }
    };

    //Update Expense Head
    async updateHead(expenseHeadInput: ExpenseHeadInput, id: string, reqUser: ReqUser) {
        const head = await this.headRepository.findOneBy({
            id: id
        });
        if (!head) throw new NotFoundException("Expense head not found!");
        if (head.title !== expenseHeadInput.title) {
            const exist = await this.headRepository.findOneBy({
                title: expenseHeadInput.title
            });
            if (exist) throw new NotFoundException("Please try different title!");
        };
        await this.headRepository.update(id, {
            ...expenseHeadInput,
            createdBy: { id: reqUser.id }
        });
        return {
            success: true,
            message: "Expense Head Updated Successfully!"
        }
    };

    //Delete Expense Head
    async deleteHead(id: string) {
        try {
            const result = await this.headRepository.delete(id);
            if (result.affected === 0) throw new NotFoundException("Expense head not found!");
        } catch {
            throw new NotFoundException("Cannot delete expense head because it has related record!")
        }
        return {
            success: true,
            message: "Expense Head delete successfully!"
        }
    };

    //-----------------------------------Expense-------------------------------------//
    //Get All expense with pagination
    async getExpense(searchInput: SearchInput) {
        const expense = await this.expenseRepository
            .createQueryBuilder("expense")
            .leftJoinAndSelect("expense.createdBy", "createdBy")
            .leftJoinAndSelect("expense.head", "head")
            .orderBy("expense.created_at", searchInput.orderBy ?? "DESC")

        if (searchInput.search) {
            expense.where("LOWER(expense.name) LIKE :search", { search: `%${searchInput.search.toLowerCase()}%` })
        }

        const { items, meta } = await paginate<Expense>(expense, {
            page: searchInput.page,
            limit: searchInput.limit,
            paginationType: PaginationTypeEnum.TAKE_AND_SKIP
        });
        return {
            results: items,
            meta
        }
    };

    //Get All expense with pagination
    async getAllExpense() {
        const expense = await this.expenseRepository.find({
            relations: {
                head: true,
                createdBy: true
            },
            order: {
                created_at: "DESC"
            }
        });
        return expense;
    }

    //Add Expense
    async addExpense(expenseInput: ExpenseInput, reqUser: ReqUser) {
        const expense = this.expenseRepository.create({
            ...expenseInput,
            head: { id: expenseInput.head },
            createdBy: { id: reqUser.id }
        });
        await this.expenseRepository.save(expense);
        return {
            success: true,
            message: "Expense Added Successfully!"
        }
    };

    //Update Expense
    async updateExpense(expenseInput: ExpenseInput, id: string, reqUser: ReqUser) {
        const result = await this.expenseRepository.update(id, {
            ...expenseInput,
            head: { id: expenseInput.head },
            createdBy: { id: reqUser.id }
        });
        if (result.affected === 0) throw new NotFoundException("Expense not found!");
        return {
            success: true,
            message: "Expense updated successfully!"
        };
    };

    //Delete Expense
    async deleteExpense(id: string) {
        try {
            const result = await this.expenseRepository.delete(id);
            if (result.affected === 0) throw new NotFoundException("Expense not found!");
        } catch {
            throw new NotFoundException("Cannot delete expense because it has related record!")
        }
        return {
            success: true,
            message: "Expense delete successfully!"
        }
    };
}