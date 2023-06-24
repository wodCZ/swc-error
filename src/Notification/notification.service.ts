import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { paginate, PaginationTypeEnum } from "nestjs-typeorm-paginate";

//Pubsub
import { pubsub } from "@/helper/pubsub.subscription";

//Entities
import { Receivers, Notification } from "./model/notification.entity";
import { Student } from "@/student/model/student.entity";

//Dto
import { NotificationInput } from "./dto/notification.dto";
import { SearchInput } from "@/section/dto/search.dto";

//Req user
import { ReqUser } from "@/auth/Types/user.types";

@Injectable()
export class NotificationService {
    //Constructor
    constructor(
        @InjectRepository(Receivers) private receiverRepository: Repository<Receivers>,
        @InjectRepository(Notification) private notificationRepository: Repository<Notification>,
        @InjectRepository(Student) private studentRepository: Repository<Student>
    ) { };

    //Get notifications
    async gets(reqUser: ReqUser) {
        const student = await this.studentRepository.findOne({
            where: {
                accountId: { id: reqUser.id }
            },
            relations: {
                class: true
            }
        });
        const notifications = await this.notificationRepository.find({
            where: {
                receivers: [
                    { to: reqUser.id },
                    { to: reqUser.role },
                    { to: student?.class?.id }
                ]
            },
            relations: {
                receivers: true,
                senderId: true
            },
            order: {
                created_at: "DESC"
            }
        });
        return notifications;
    };

    //Get All Notifications with pagination
    async getAll(searchInput: SearchInput) {
        const notifications = await this.notificationRepository
            .createQueryBuilder("notification")
            .leftJoinAndSelect("notification.receivers", "receivers")
            .leftJoinAndSelect("notification.senderId", "senderId")
            .orderBy("notification.created_at", searchInput.orderBy ?? "DESC")
            .where("notification.type IN (:...types)", { types: ["role", "individual", "class"] })

        if (searchInput.search) {
            notifications.andWhere("LOWER(notification.title) LIKE :search", { search: `%${searchInput.search.toLowerCase()}%` })
        }
        const { items, meta } = await paginate<Notification>(notifications, {
            page: searchInput.page,
            limit: searchInput.limit,
            paginationType: PaginationTypeEnum.TAKE_AND_SKIP
        });
        return {
            results: items,
            meta
        }
    };

    //Get All Notifications without pagination
    async getAllWithout() {
        const notifications = await this.notificationRepository.find({
            relations: {
                receivers: true,
                senderId: true
            },
            order: {
                created_at: "DESC"
            }
        });
        return notifications;
    }

    //Add new notification
    async add(notificationInput: NotificationInput, reqUser: ReqUser) {
        const receiversData = await Promise.all(
            notificationInput.receivers.to.map((item) => {
                const receiverEntity = this.receiverRepository.create({
                    to: item
                });
                return this.receiverRepository.save(receiverEntity);
            })
        );
        const notification = this.notificationRepository.create({
            title: notificationInput.title,
            details: notificationInput.details,
            image: notificationInput.image,
            type: notificationInput.receivers.type,
            receivers: receiversData,
            senderId: { id: reqUser.id }
        });
        await this.notificationRepository.save(notification);
        console.log(notification);
        pubsub.publish("notification", {
            notifyEvent: notification
        });
        return {
            success: true,
            message: "Notification sent successfully!"
        }
    };


    //Mark as read
    async read(id: string) {
        const result = await this.notificationRepository.update(id, {
            read: true
        });
        if (result.affected === 0) throw new NotFoundException("Notification not found!");
        return {
            success: true,
            message: "Notification mark as read successfully!"
        }
    }
}