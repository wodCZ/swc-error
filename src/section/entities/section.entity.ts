import { ObjectType, Field } from "@nestjs/graphql";

//User Entity
import { User } from "@/user/entities/user.entity";
import { Meta } from "./meta.entity";

@ObjectType()
export class Section {
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
export class GetSection {
    @Field(() => [Section], { nullable: true })
    results: Section[];
    @Field(() => Meta, { nullable: true })
    meta: Meta;
}