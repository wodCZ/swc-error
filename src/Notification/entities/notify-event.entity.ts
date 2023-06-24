import { ObjectType, Field, HideField } from "@nestjs/graphql";

//Entity
import { Path } from "./notification.entity";
import { Receivers } from "./all-notification.entity";

@ObjectType()
export class NotifyEvent {
    @Field(() => String, { nullable: false })
    id: string;
    @Field(() => String, { nullable: true })
    title: string;
    @Field(() => String, { nullable: true })
    details: string;
    @Field(() => String, { nullable: true })
    image: string;
    @Field(() => Boolean, { nullable: true })
    read: boolean;
    @Field(() => Path, { nullable: true })
    path: Path;
    @HideField()
    receivers: Receivers[];
    @Field(() => String, { nullable: true })
    created_at: Date;
}