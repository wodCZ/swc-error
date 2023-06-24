import { InputType, Field } from "@nestjs/graphql";
import { IsNotEmpty, IsString } from "class-validator";

@InputType()
export class PresentInput {
    @Field(() => String, { nullable: false })
    @IsNotEmpty()
    @IsString()
    id: string;

    @Field(() => String, { nullable: false })
    @IsNotEmpty()
    @IsString()
    present: string;
}