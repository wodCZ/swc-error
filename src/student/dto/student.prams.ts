import { InputType, Field } from "@nestjs/graphql";
import { IsOptional, IsString } from "class-validator";

@InputType()
export class StudentPramsInput {
    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    name: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    id: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    class: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    shift: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    section: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    group: string;
}