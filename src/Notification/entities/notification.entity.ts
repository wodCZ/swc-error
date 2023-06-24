import { ObjectType, Field } from "@nestjs/graphql";

@ObjectType()
export class Path {
    @Field(() => String, { nullable: true })
    id: string;
    @Field(() => String, { nullable: true })
    type: string;
}

@ObjectType()
export class Notification {
    @Field(() => String, { nullable: false })
    id: string;
    @Field(() => String, { nullable: true })
    title: string;
    @Field(() => String, { nullable: true })
    details: string;
    @Field(() => String, { nullable: true })
    image: string;
    @Field(() => Boolean, { nullable: true })
    read: boolean;
    @Field(() => Path, { nullable: true })
    path: Path;
    @Field(() => Date, { nullable: true })
    created_at: Date;
}