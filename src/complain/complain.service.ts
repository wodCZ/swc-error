import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { paginate, PaginationTypeEnum } from "nestjs-typeorm-paginate";

//Pub Sub
import { pubsub } from "@/helper/pubsub.subscription";

//Orm Entity
import { Complain } from "./model/complain.entity";
import { Notification, Receivers } from "@/Notification/model/notification.entity";

//Dto
import { ComplainInput } from "./dto/complain.dto";
import { SearchInput } from "@/section/dto/search.dto";
import { ComplainStatusInput } from "./dto/status.dto";

//Req user
import { ReqUser } from "@/auth/Types/user.types";

@Injectable()
export class ComplainService {
    //Constructor
    constructor(
        @InjectRepository(Complain) private complainRepository: Repository<Complain>,
        @InjectRepository(Notification) private notificationRepository: Repository<Notification>,
        @InjectRepository(Receivers) private receiverRepository: Repository<Receivers>
    ) { };

    //Get complain list with pagination
    async gets(searchInput: SearchInput) {
        const complains = await this.complainRepository
            .createQueryBuilder("complain")
            .leftJoinAndSelect("complain.complainBy", "complainBy")
            .orderBy("complain.created_at", searchInput.orderBy ?? "DESC")

        if (searchInput.search) {
            complains.where("LOWER(complain.name) LIKE :search", { search: `%${searchInput.search.toLowerCase()}%` })
        }
        const { items, meta } = await paginate<Complain>(complains, {
            page: searchInput.page,
            limit: searchInput.limit,
            paginationType: PaginationTypeEnum.TAKE_AND_SKIP
        });
        return {
            results: items,
            meta
        }
    };

    //Get complain list with pagination
    async getAll() {
        const complain = await this.complainRepository.find({
            relations: {
                complainBy: true
            },
            order: {
                created_at: "DESC"
            }
        });
        return complain;
    }

    //Add Complain
    async add(complainInput: ComplainInput, reqUser: ReqUser) {
        const complain = this.complainRepository.create({
            ...complainInput,
            complainBy: { id: reqUser.id }
        });
        await this.complainRepository.save(complain);
        const receivers = [{ to: "principal" }, { to: "accountant" }]
        const receiversData = await Promise.all(
            receivers.map((item) => {
                const receiverEntity = this.receiverRepository.create({
                    to: item.to
                })
                return this.receiverRepository.save(receiverEntity);
            })
        )
        const notification = this.notificationRepository.create({
            title: "Someone place a new complain!",
            details: complainInput.description.substring(0, 160),
            receivers: receiversData,
            path: { type: "complain" },
            senderId: { id: reqUser.id }
        });
        await this.notificationRepository.save(notification);
        pubsub.publish("notification", { notifyEvent: notification });
        return {
            success: true,
            message: "Complain added successfully!"
        }
    };

    //Update Complain
    async status(complainStatusInput: ComplainStatusInput) {
        const result = await this.complainRepository.update(complainStatusInput.id, {
            status: complainStatusInput.status
        });
        if (result.affected === 0) throw new NotFoundException("Complain not found!");
        return {
            success: true,
            message: "Complain status changed successfully!"
        }
    }
}