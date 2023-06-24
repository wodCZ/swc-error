import { InputType, Field } from "@nestjs/graphql";
import { IsNotEmpty, IsString, IsOptional, IsArray } from "class-validator";

@InputType()
export class ClassInput {
    @Field(() => String, { nullable: false })
    @IsNotEmpty()
    @IsString()
    name: string;

    @Field(() => [String], { nullable: true })
    @IsOptional()
    @IsArray()
    section: string[];

    @Field(() => [String], { nullable: true })
    @IsOptional()
    @IsArray()
    group: string[];

    @Field(() => [String], { nullable: false })
    @IsNotEmpty()
    @IsArray()
    shift: string[];
}