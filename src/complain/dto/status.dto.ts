import { InputType, Field } from "@nestjs/graphql";
import { IsNotEmpty, IsString } from "class-validator";

@InputType()
export class ComplainStatusInput {
    @Field(() => String, { nullable: false })
    @IsNotEmpty()
    @IsString()
    id: string;

    @Field(() => String, { nullable: false })
    @IsNotEmpty()
    @IsString()
    status: string;
}