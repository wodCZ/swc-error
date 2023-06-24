import { ObjectType, Field } from "@nestjs/graphql";

//Entities
import { User } from "@/user/entities/user.entity";
import { Class } from "@/class/entities/class.entity";
import { Shift } from "@/shift/entity/shift.entity";
import { Section } from "@/section/entities/section.entity";
import { Group } from "@/group/entities/group.entity";
import { Meta } from "@/section/entities/meta.entity";

@ObjectType()
export class Student {
    @Field(() => String, { nullable: false })
    id: string;
    @Field(() => String, { nullable: false })
    studentId: string;
    @Field(() => String, { nullable: true })
    image: string;
    @Field(() => Class, { nullable: true })
    class: Class;
    @Field(() => Shift, { nullable: true })
    shift: Shift;
    @Field(() => Section, { nullable: true })
    section: Section;
    @Field(() => Group, { nullable: true })
    group: Group;
    @Field(() => String, { nullable: false })
    name: string;
    @Field(() => String, { nullable: false })
    roll: string;
    @Field(() => String, { nullable: false })
    session: string;
    @Field(() => String, { nullable: true })
    gender: string;
    @Field(() => String, { nullable: true })
    dob: string;
    @Field(() => String, { nullable: true })
    blood: string;
    @Field(() => String, { nullable: true })
    religion: string;
    @Field(() => String, { nullable: true })
    number: string;
    @Field(() => String, { nullable: true })
    email: string;
    @Field(() => String, { nullable: true })
    admissionDate: string;
    @Field(() => String, { nullable: true })
    birthCertificate: string;
    @Field(() => String, { nullable: false })
    fatherName: string;
    @Field(() => String, { nullable: true })
    fatherNidNumber: string;
    @Field(() => String, { nullable: true })
    fatherPhone: string;
    @Field(() => String, { nullable: false })
    motherName: string;
    @Field(() => String, { nullable: true })
    motherNidNumber: string;
    @Field(() => String, { nullable: true })
    motherPhone: string;
    @Field(() => String, { nullable: true })
    fee_start: string;
    @Field(() => String, { nullable: true })
    guardianName: string;
    @Field(() => String, { nullable: true })
    guardianNidNumber: string;
    @Field(() => String, { nullable: true })
    guardianPhone: string;
    @Field(() => String, { nullable: false })
    address: string;
    @Field(() => String, { nullable: false })
    school: string;
    @Field(() => User, { nullable: true })
    createdBy: User;
    @Field(() => Date, { nullable: false })
    updated_at: Date;
    @Field(() => Date, { nullable: false })
    created_at: Date;
}


@ObjectType()
export class GetStudent {
    @Field(() => [Student], { nullable: true })
    results: [Student]
    @Field(() => Meta, { nullable: true })
    meta: Meta;
}