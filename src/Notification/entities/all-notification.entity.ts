import { ObjectType, Field } from "@nestjs/graphql";

//Entity
import { Path } from "./notification.entity";
import { User } from "@/user/entities/user.entity";
import { Meta } from "@/section/entities/meta.entity";

@ObjectType()
export class Receivers {
    @Field(() => String, { nullable: false })
    id: string;

    @Field(() => String, { nullable: false })
    to: string;
}

@ObjectType()
export class AllNotification {
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
    @Field(() => String, { nullable: true })
    type: string;
    @Field(() => [Receivers], { nullable: true })
    receivers: Receivers[];
    @Field(() => User, { nullable: true })
    senderId: User;
    @Field(() => Path, { nullable: true })
    path: Path;
    @Field(() => Date, { nullable: true })
    created_at: Date;
}

@ObjectType()
export class GetAllNotification {
    @Field(() => [AllNotification], { nullable: true })
    results: AllNotification[];
    @Field(() => Meta, { nullable: true })
    meta: Meta;
}