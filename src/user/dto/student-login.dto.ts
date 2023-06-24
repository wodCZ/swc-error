import { InputType, Field } from "@nestjs/graphql";
import { IsString, IsNotEmpty } from "class-validator";

@InputType()
export class StudentLoginInput {
    @Field(() => String, { nullable: false })
    @IsString()
    @IsNotEmpty()
    studentId: string;

    @Field(() => String, { nullable: false })
    @IsString()
    @IsNotEmpty()
    password: string;
}