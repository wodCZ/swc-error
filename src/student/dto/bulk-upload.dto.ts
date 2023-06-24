import { InputType, Field } from "@nestjs/graphql";

//Dto
import { StudentInput } from "./student.dto";

@InputType()
export class BulkInput {
    @Field(() => [StudentInput], { nullable: false })
    data: StudentInput[];
}