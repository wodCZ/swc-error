import { ObjectType, Field, Float } from "@nestjs/graphql";

//Entities
import { User } from "@/user/entities/user.entity";
import { Meta } from "@/section/entities/meta.entity";

@ObjectType()
export class Room {
    @Field(() => String, { nullable: false })
    id: string;
    @Field(() => String, { nullable: false })
    room_no: string;
    @Field(() => Float, { nullable: false })
    capacity: number;
    @Field(() => User, { nullable: true })
    createdBy: User;
    @Field(() => Date, { nullable: false })
    updated_at: Date;
    @Field(() => Date, { nullable: false })
    created_at: Date;
}

@ObjectType()
export class GetRoom {
    @Field(() => [Room], { nullable: true })
    results: Room[];
    @Field(() => Meta, { nullable: true })
    meta: Meta;
}