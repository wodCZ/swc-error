import { ObjectType, Field } from "@nestjs/graphql";

//Entities
import { Student } from "@/student/entities/student.entity";

@ObjectType()
export class StudentAttendance {
    @Field(() => String, { nullable: false })
    id: string;
    @Field(() => String, { nullable: false })
    present: string;
    @Field(() => Student, { nullable: true })
    student: Student;
    @Field(() => Date, { nullable: false })
    updated_at: Date;
    @Field(() => Date, { nullable: false })
    created_at: Date;
}