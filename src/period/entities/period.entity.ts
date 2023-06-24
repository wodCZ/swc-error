import { ObjectType, Field } from "@nestjs/graphql";

//Entities
import { User } from "@/user/entities/user.entity";
import { Shift } from "@/shift/entity/shift.entity";
import { Meta } from "@/section/entities/meta.entity";

@ObjectType()
export class Period {
    @Field(() => String, { nullable: false })
    id: string;
    @Field(() => String, { nullable: false })
    name: string;
    @Field(() => String, { nullable: false })
    start: string;
    @Field(() => String, { nullable: false })
    end: string;
    @Field(() => Boolean, { nullable: false })
    is_break: boolean;
    @Field(() => Shift, { nullable: true })
    shift: Shift;
    @Field(() => User, { nullable: true })
    createdBy: User;
    @Field(() => Date, { nullable: false })
    updated_at: Date;
    @Field(() => Date, { nullable: false })
    created_at: Date;
}

@ObjectType()
export class GetPeriod {
    @Field(() => [Period], { nullable: true })
    results: Period[];
    @Field(() => Meta, { nullable: true })
    meta: Meta;
}