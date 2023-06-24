import { ObjectType, Field } from "@nestjs/graphql";

//Entities
import { ExpenseHead } from "./expense-head.entity";
import { User } from "@/user/entities/user.entity";
import { Meta } from "@/section/entities/meta.entity";

@ObjectType()
export class Expense {
    @Field(() => String, { nullable: false })
    id: string;
    @Field(() => ExpenseHead, { nullable: false })
    head: ExpenseHead;
    @Field(() => String, { nullable: false })
    name: string;
    @Field(() => String, { nullable: false })
    amount: string;
    @Field(() => String, { nullable: true })
    invoice: string;
    @Field(() => String, { nullable: true })
    date: string;
    @Field(() => String, { nullable: true })
    file: string;
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
export class GetExpense {
    @Field(() => [Expense], { nullable: true })
    results: Expense[];
    @Field(() => Meta, { nullable: true })
    meta: Meta;
}