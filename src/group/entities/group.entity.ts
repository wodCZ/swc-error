import { ObjectType, Field } from "@nestjs/graphql";

//User Entity
import { User } from "@/user/entities/user.entity";
import { Meta } from "@/section/entities/meta.entity";

@ObjectType()
export class Group {
    @Field(() => String, { nullable: false })
    id: string;
    @Field(() => String, { nullable: false })
    name: string;
    @Field(() => User, { nullable: true })
    createdBy: User;
    @Field(() => Date, { nullable: false })
    updated_at: Date;
    @Field(() => Date, { nullable: false })
    created_at: Date;
}


@ObjectType()
export class GetGroup {
    @Field(() => [Group], { nullable: true })
    results: Group[];
    @Field(() => Meta, { nullable: true })
    meta: Meta
}