import { InputType, Field } from "@nestjs/graphql";
import { IsString, IsNotEmpty, IsOptional } from "class-validator";

@InputType()
export class IncomeHeadInput {
    @Field(() => String, { nullable: false })
    @IsString()
    @IsNotEmpty()
    title: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    description: string;
}