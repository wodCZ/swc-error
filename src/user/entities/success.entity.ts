import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class SuccessInfo {
    @Field(() => String, { nullable: false })
    message: string;
    @Field(() => Boolean, { nullable: false })
    success: boolean;
}