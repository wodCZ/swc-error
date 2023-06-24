import { InputType, Field } from "@nestjs/graphql";
import { IsString, IsNotEmpty, IsOptional } from "class-validator";

@InputType()
export class ExpenseInput {
    @Field(() => String, { nullable: false })
    @IsString()
    @IsNotEmpty()
    head: string;

    @Field(() => String, { nullable: false })
    @IsString()
    @IsNotEmpty()
    name: string;

    @Field(() => String, { nullable: false })
    @IsString()
    @IsNotEmpty()
    amount: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    invoice: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    date: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    file: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    description: string;
}