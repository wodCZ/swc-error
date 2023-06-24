import { InputType, Field } from "@nestjs/graphql";
import { IsNotEmpty, IsString } from "class-validator";

@InputType()
export class ResendInput {
    @Field(() => String, { nullable: false })
    @IsNotEmpty()
    @IsString()
    phone: string;
}