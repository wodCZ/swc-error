import { InputType, Field, Float } from "@nestjs/graphql";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

@InputType()
export class RoomInput {
    @Field(() => String, { nullable: false })
    @IsNotEmpty()
    @IsString()
    room_no: string;

    @Field(() => Float, { nullable: false })
    @IsNotEmpty()
    @IsNumber()
    capacity: number;
}