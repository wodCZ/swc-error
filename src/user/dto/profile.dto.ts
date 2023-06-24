import { InputType, Field } from "@nestjs/graphql";
import { IsNotEmpty, IsString } from "class-validator";

@InputType()
export class ProfileInput {
    @Field(() => String, { nullable: false })
    @IsNotEmpty()
    @IsString()
    image: string;

    @Field(() => String, { nullable: false })
    @IsNotEmpty()
    @IsString()
    name: string;
}