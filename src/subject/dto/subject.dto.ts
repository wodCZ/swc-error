import { InputType, Field } from "@nestjs/graphql";
import { IsNotEmpty, IsString, IsEnum } from "class-validator";

@InputType()
export class SubjectInput {
    @Field(() => String, { nullable: false })
    @IsNotEmpty()
    @IsString()
    name: string;

    @Field(() => String, { nullable: false })
    @IsNotEmpty()
    @IsEnum(["practical", "theory"])
    type: string;

    @Field(() => String, { nullable: false })
    @IsNotEmpty()
    @IsString()
    code: string;

    @Field(() => String, { nullable: false })
    @IsNotEmpty()
    @IsEnum(["low", "medium", "high"])
    priority: string;
}