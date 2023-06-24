import { UseGuards } from "@nestjs/common";
import { Resolver, Mutation, Query, Subscription, Args, Context } from "@nestjs/graphql";

//Pubsub
import { pubsub } from "@/helper/pubsub.subscription";

//Service
import { NotificationService } from "./notification.service";

//Dto
import { NotificationInput } from "./dto/notification.dto";
import { SearchInput } from "@/section/dto/search.dto";

//Entities
import { SuccessInfo } from "@/user/entities/success.entity";
import { Notification } from "./entities/notification.entity";
import { NotifyEvent } from "./entities/notify-event.entity";
import { GetAllNotification, AllNotification } from "./entities/all-notification.entity";

//Auth guards
import { AuthGuard } from "@/auth/auth.guard";
import { RolesGuard } from "@/auth/roles.guard";
import { Role } from "@/auth/enum/auth.enum";
import { Roles } from "@/auth/decorator/auth.decorator";

//Req user
import { ReqUser } from "@/auth/Types/user.types";
import { EventReqUser } from "@/events/types/event-user.types";

@Resolver()
export class NotificationResolver {
    //Constructor
    constructor(
        private readonly notificationService: NotificationService
    ) { };

    //Get notification
    @Query(() => [Notification], { name: "getNotifications" })
    @UseGuards(AuthGuard)
    gets(
        @Context("user") reqUser: ReqUser
    ) {
        return this.notificationService.gets(reqUser);
    };

    //Get All Notifications with pagination
    @Query(() => GetAllNotification, { name: "getAllNotifications" })
    @Roles(Role.ACCOUNTANT, Role.PRINCIPAL)
    @UseGuards(AuthGuard, RolesGuard)
    getAll(
        @Args("searchInput") searchInput: SearchInput
    ) {
        return this.notificationService.getAll(searchInput);
    };

    //Get All Notifications without pagination
    @Query(() => [AllNotification], { name: "getAllNotificationsWithoutPagination" })
    @Roles(Role.ACCOUNTANT, Role.PRINCIPAL)
    @UseGuards(AuthGuard, RolesGuard)
    getAllWithout() {
        return this.notificationService.getAllWithout();
    };

    //Create a new notification
    @Mutation(() => SuccessInfo, { name: "addNotification" })
    @Roles(Role.ACCOUNTANT, Role.PRINCIPAL)
    @UseGuards(AuthGuard, RolesGuard)
    add(
        @Args("notificationInput") notificationInput: NotificationInput,
        @Context("user") reqUser: ReqUser
    ) {
        return this.notificationService.add(notificationInput, reqUser)
    };

    //Set as Read
    @Mutation(() => SuccessInfo, { name: "markAsReadNotification" })
    @UseGuards(AuthGuard)
    read(
        @Args("id") id: string
    ) {
        return this.notificationService.read(id);
    };


    //Sent Notifications
    @Subscription(() => NotifyEvent, {
        name: "notifyEvent",
        filter: (payload: { notifyEvent: NotifyEvent }, _, context: { extra: { user: EventReqUser } }) => {
            return payload.notifyEvent.receivers.some(receiver => receiver.to === context.extra.user.role || receiver.to === context.extra.user.id || receiver.to === context.extra.user.classId)
        }
    })
    notification() {
        return pubsub.asyncIterator("notification");
    };
}