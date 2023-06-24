import { ObjectType, Field } from "@nestjs/graphql";

//Entities
import { User } from "@/user/entities/user.entity";
import { Meta } from "@/section/entities/meta.entity";

@ObjectType()
export class ExpenseHead {
    @Field(() => String, { nullable: false })
    id: string;
    @Field(() => String, { nullable: false })
    title: string;
    @Field(() => String, { nullable: true })
    description: string;
    @Field(() => User, { nullable: true })
    createdBy: User;
    @Field(() => Date, { nullable: false })
    updated_at: Date;
    @Field(() => Date, { nullable: false })
    created_at: Date;
}

@ObjectType()
export class GetExpenseHead {
    @Field(() => [ExpenseHead], { nullable: true })
    results: ExpenseHead[];
    @Field(() => Meta, { nullable: true })
    meta: Meta;
}