import { ObjectType, Field } from "@nestjs/graphql";

//User Entity
import { User } from "@/user/entities/user.entity";
import { Meta } from "@/section/entities/meta.entity";

@ObjectType()
export class Complain {
    @Field(() => String, { nullable: false })
    id: string;
    @Field(() => String, { nullable: false })
    title: string;
    @Field(() => String, { nullable: false })
    description: string;
    @Field(() => String, { nullable: false })
    status: string;
    @Field(() => User, { nullable: true })
    complainBy: User;
    @Field(() => Boolean, { nullable: false })
    anonymous: boolean;
    @Field(() => Date, { nullable: false })
    updated_at: Date;
    @Field(() => Date, { nullable: false })
    created_at: Date;
}


@ObjectType()
export class GetComplain {
    @Field(() => [Complain], { nullable: true })
    results: Complain[];
    @Field(() => Meta, { nullable: true })
    meta: Meta;
}