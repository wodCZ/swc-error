import { ObjectType, Field } from "@nestjs/graphql";

//Entities
import { IncomeHead } from "./income-head.entity";
import { User } from "@/user/entities/user.entity";
import { Meta } from "@/section/entities/meta.entity";

@ObjectType()
export class Income {
    @Field(() => String, { nullable: false })
    id: string;
    @Field(() => IncomeHead, { nullable: false })
    head: IncomeHead;
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
export class GetIncome {
    @Field(() => [Income], { nullable: true })
    results: Income[];
    @Field(() => Meta, { nullable: true })
    meta: Meta;
}
