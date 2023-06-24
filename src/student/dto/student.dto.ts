import { InputType, Field } from "@nestjs/graphql";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

@InputType()
export class StudentInput {
    @Field(() => String, { nullable: false })
    @IsNotEmpty()
    @IsString()
    studentId: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    image: string;

    @Field(() => String, { nullable: false })
    @IsNotEmpty()
    @IsString()
    class: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    shift: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    section: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    group: string;

    @Field(() => String, { nullable: false })
    @IsNotEmpty()
    @IsString()
    name: string;

    @Field(() => String, { nullable: false })
    @IsNotEmpty()
    @IsString()
    roll: string;

    @Field(() => String, { nullable: false })
    @IsNotEmpty()
    @IsString()
    session: string;

    @Field(() => String, { nullable: false })
    @IsNotEmpty()
    @IsString()
    gender: string;

    @Field(() => String, { nullable: false })
    @IsNotEmpty()
    @IsString()
    dob: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    blood: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    religion: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    number: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    email: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    admissionDate: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    birthCertificate: string;

    @Field(() => String, { nullable: false })
    @IsNotEmpty()
    @IsString()
    fatherName: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    fatherNidNumber: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    fatherPhone: string;

    @Field(() => String, { nullable: false })
    @IsNotEmpty()
    @IsString()
    motherName: string;

    @Field(() => String, { nullable: false })
    @IsNotEmpty()
    @IsString()
    fee_start: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    motherNidNumber: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    motherPhone: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    guardianName: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    guardianNidNumber: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    guardianPhone: string;

    @Field(() => String, { nullable: false })
    @IsNotEmpty()
    @IsString()
    address: string;

    @Field(() => String, { nullable: false })
    @IsNotEmpty()
    @IsString()
    school: string;
}