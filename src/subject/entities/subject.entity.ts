import { ObjectType, Field } from "@nestjs/graphql";

//Entities
import { User } from "@/user/entities/user.entity";
import { Meta } from "@/section/entities/meta.entity";

@ObjectType()
export class Subject {
    @Field(() => String, { nullable: false })
    id: string;
    @Field(() => String, { nullable: false })
    name: string;
    @Field(() => String, { nullable: false })
    type: string;
    @Field(() => String, { nullable: false })
    code: string;
    @Field(() => String, { nullable: true })
    priority: string;
    @Field(() => User, { nullable: true })
    createdBy: User;
    @Field(() => Date, { nullable: false })
    updated_at: Date;
    @Field(() => Date, { nullable: false })
    created_at: Date;
}

@ObjectType()
export class GetSubject {
    @Field(() => [Subject], { nullable: true })
    results: Subject[];
    @Field(() => Meta, { nullable: true })
    meta: Meta;
}