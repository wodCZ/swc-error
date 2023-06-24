import { InputType, Field } from "@nestjs/graphql";
import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

@InputType()
export class ComplainInput {
    @Field(() => String, { nullable: false })
    @IsNotEmpty()
    @IsString()
    title: string;

    @Field(() => String, { nullable: false })
    @IsNotEmpty()
    @IsString()
    description: string;

    @Field(() => Boolean, { nullable: false })
    @IsNotEmpty()
    @IsBoolean()
    anonymous: boolean;
}