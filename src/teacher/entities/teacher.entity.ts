import { ObjectType, Field } from "@nestjs/graphql";

//User Entity
import { Meta } from "@/section/entities/meta.entity";
import { User } from "@/user/entities/user.entity";

@ObjectType()
export class Teacher {
    @Field(() => String, { nullable: false })
    id: string;
    @Field(() => String, { nullable: false })
    name: string;
    @Field(() => String, { nullable: false })
    image: string;
    @Field(() => String, { nullable: false })
    phone: string;
    @Field(() => String, { nullable: false })
    email: string;
    @Field(() => String, { nullable: false })
    dob: string;
    @Field(() => String, { nullable: false })
    gender: string;
    @Field(() => String, { nullable: false })
    nid: string;
    @Field(() => String, { nullable: false })
    education: string;
    @Field(() => String, { nullable: true })
    emergencyPhone: string;
    @Field(() => String, { nullable: true })
    appointment: string;
    @Field(() => String, { nullable: false })
    salary: string;
    @Field(() => String, { nullable: false })
    address: string;
    @Field(() => String, { nullable: true })
    document: string;
    @Field(() => User, { nullable: true })
    createdBy: User;
    @Field(() => Date, { nullable: false })
    updated_at: Date;
    @Field(() => Date, { nullable: false })
    created_at: Date;
}


@ObjectType()
export class GetTeachers {
    @Field(() => [Teacher], { nullable: false })
    results: Teacher[];
    @Field(() => Meta, { nullable: false })
    meta: Meta;
}