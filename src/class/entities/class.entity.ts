import { ObjectType, Field } from "@nestjs/graphql";

//Entities
import { User } from "@/user/entities/user.entity";
import { Section } from "@/section/entities/section.entity";
import { Group } from "@/group/entities/group.entity";
import { Shift } from "@/shift/entity/shift.entity";
import { Meta } from "@/section/entities/meta.entity";

@ObjectType()
export class Class {
    @Field(() => String, { nullable: false })
    id: string;
    @Field(() => String, { nullable: false })
    name: string;
    @Field(() => [Section], { nullable: true })
    section: Section[];
    @Field(() => [Group], { nullable: true })
    group: Group[];
    @Field(() => [Shift], { nullable: true })
    shift: Shift[];
    @Field(() => User, { nullable: true })
    createdBy: User;
    @Field(() => Date, { nullable: false })
    updated_at: Date;
    @Field(() => Date, { nullable: false })
    created_at: Date;
}

@ObjectType()
export class GetClass {
    @Field(() => [Class], { nullable: true })
    results: Class;
    @Field(() => Meta, { nullable: true })
    meta: Meta
}
