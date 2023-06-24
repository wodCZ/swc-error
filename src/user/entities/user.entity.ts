import { ObjectType, Field } from "@nestjs/graphql";

@ObjectType()
export class User {
    @Field(() => String, { nullable: false })
    id: string;
    @Field(() => String, { nullable: true })
    phone: string;
    @Field(() => String, { nullable: true })
    name: string;
    @Field(() => String, { nullable: true })
    studentId: string;
    @Field(() => String, { nullable: true })
    image: string;
    @Field(() => String, { nullable: true })
    role: string;
    @Field(() => Boolean, { nullable: true })
    is_verify: boolean;
    @Field(() => Date, { nullable: false })
    updated_at: Date;
    @Field(() => Date, { nullable: false })
    created_at: Date;
}