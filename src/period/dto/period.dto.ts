import { InputType, Field } from "@nestjs/graphql";
import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

@InputType()
export class PeriodInput {
    @Field(() => String, { nullable: false })
    @IsNotEmpty()
    @IsString()
    name: string;

    @Field(() => Boolean, { nullable: false })
    @IsNotEmpty()
    @IsBoolean()
    is_break: boolean;

    @Field(() => String, { nullable: false })
    @IsNotEmpty()
    @IsString()
    start: string;

    @Field(() => String, { nullable: false })
    @IsNotEmpty()
    @IsString()
    shift: string;

    @Field(() => String, { nullable: false })
    @IsNotEmpty()
    @IsString()
    end: string;
}