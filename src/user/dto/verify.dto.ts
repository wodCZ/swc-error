import { InputType, Field } from "@nestjs/graphql";
import { IsNotEmpty, IsString } from "class-validator";

@InputType()
export class VerifyInput {
    @Field(() => String, { nullable: false })
    @IsNotEmpty()
    @IsString()
    phone: string;

    @Field(() => String, { nullable: false })
    @IsNotEmpty()
    @IsString()
    otp: string;
}