import { InputType, Field } from "@nestjs/graphql";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

@InputType()
export class AttendanceInput {
    @Field(() => String, { nullable: false })
    @IsNotEmpty()
    @IsString()
    class: string;

    @Field(() => String, { nullable: false })
    @IsNotEmpty()
    @IsString()
    shift: string;

    @Field(() => String, { nullable: false })
    @IsNotEmpty()
    @IsString()
    section: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    group: string;

    @Field(() => String, { nullable: false })
    @IsNotEmpty()
    @IsString()
    date: string;
}