import { InputType, Field } from "@nestjs/graphql";
import { IsNotEmpty, IsString, IsOptional } from "class-validator";

@InputType()
export class TeacherInput {
    @Field(() => String, { nullable: false })
    @IsNotEmpty()
    @IsString()
    name: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    image: string;

    @Field(() => String, { nullable: false })
    @IsNotEmpty()
    @IsString()
    phone: string;

    @Field(() => String, { nullable: false })
    @IsNotEmpty()
    @IsString()
    email: string;

    @Field(() => String, { nullable: false })
    @IsNotEmpty()
    @IsString()
    dob: string;

    @Field(() => String, { nullable: false })
    @IsNotEmpty()
    @IsString()
    gender: string;


    @Field(() => String, { nullable: false })
    @IsNotEmpty()
    @IsString()
    nid: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    education: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    emergencyPhone: string;

    @Field(() => String, { nullable: false })
    @IsNotEmpty()
    @IsString()
    appointment: string;

    @Field(() => String, { nullable: false })
    @IsNotEmpty()
    @IsString()
    salary: string;

    @Field(() => String, { nullable: false })
    @IsNotEmpty()
    @IsString()
    address: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    document: string;
}