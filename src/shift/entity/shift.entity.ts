import { ObjectType, Field } from "@nestjs/graphql";

//User
import { User } from "@/user/entities/user.entity";
import { Meta } from "@/section/entities/meta.entity";

@ObjectType()
export class Shift {
    @Field(() => String, { nullable: false })
    id: string;
    @Field(() => String, { nullable: false })
    name: string;
    @Field(() => User, { nullable: false })
    createdBy: User;
    @Field(() => Date, { nullable: false })
    updated_at: Date;
    @Field(() => Date, { nullable: false })
    created_at: Date;
}

@ObjectType()
export class GetShift {
    @Field(() => [Shift], { nullable: true })
    results: Shift[];
    @Field(() => Meta, { nullable: true })
    meta: Meta;
}