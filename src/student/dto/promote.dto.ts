import { InputType, Field } from "@nestjs/graphql";
import { IsOptional, IsNotEmpty, IsArray, IsString } from "class-validator";

@InputType()
export class PromoteInput {
    @Field(() => [String], { nullable: false })
    @IsArray()
    @IsNotEmpty()
    ids: [string];

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    class: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    shift: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    section: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    group: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    markAs: string;
}