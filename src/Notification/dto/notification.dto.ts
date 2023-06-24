import { InputType, Field } from "@nestjs/graphql";
import { IsString, IsNotEmpty, IsArray, IsBoolean, IsOptional, IsObject } from "class-validator";

@InputType()
export class ReceiverInput {
    @Field(() => [String], { nullable: false })
    @IsArray()
    @IsNotEmpty()
    to: string[];

    @Field(() => String, { nullable: false })
    @IsString()
    @IsNotEmpty()
    type: string;
}

@InputType()
export class NotificationInput {
    @Field(() => String, { nullable: false })
    @IsString()
    @IsNotEmpty()
    title: string;

    @Field(() => String, { nullable: false })
    @IsString()
    @IsNotEmpty()
    details: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    image: string;

    @Field(() => ReceiverInput, { nullable: false })
    @IsNotEmpty()
    @IsObject()
    receivers: ReceiverInput;

    @Field(() => Boolean, { nullable: false })
    @IsBoolean()
    @IsNotEmpty()
    sms: boolean;
}