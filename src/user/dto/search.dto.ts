import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class UserSearchInput {
    @Field(() => String, { nullable: false })
    idOrPhone: string;
}