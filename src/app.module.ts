import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ScheduleModule } from "@nestjs/schedule";
import { Context } from "graphql-ws";
import { Request } from "express";

//Using Apollo Studio
import { ApolloServerPluginLandingPageLocalDefault, ApolloServerPluginLandingPageProductionDefault } from "@apollo/server/plugin/landingPage/default";

//Path
import { join } from "path";

//Events
import { EventModule } from "./events/events.module";
import { EventService } from "./events/events.service";

//Modules
import { UserModule } from "./user/user.module";
import { SectionModule } from "./section/section.module";
import { GroupModule } from "./group/group.module";
import { ShiftModule } from "./shift/shift.module";
import { ClassModule } from "./class/class.module";
import { SubjectModule } from "./subject/subject.module";
import { RoomModule } from "./room/room.module";
import { PeriodModule } from "./period/period.module";
import { StudentModule } from "./student/student.module";
import { TeacherModule } from "./teacher/teacher.module";
import { AttendanceModule } from "./attendance/attendance.module";
import { IncomeModule } from "./income/income.module";
import { ExpenseModule } from "./expense/expense.module";
import { ComplainModule } from "./complain/complain.module";
import { NotificationModule } from "./Notification/notification.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [EventModule],
      inject: [EventService],
      useFactory: async (eventService: EventService) => ({
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        subscriptions: {
          "graphql-ws": {
            onConnect: async (context: Context<any, { request: Request }>) => {
              const { extra } = context;
              return eventService.onConnect(extra);
            },
            onDisconnect: async (context: Context<any, { request: Request }>) => {
              const { extra } = context;
              eventService.onDisconnect(extra);
            }
          }
        },
        path: "ecampus",
        playground: false,
        plugins: [process.env.NODE_ENV === 'production'
          ? ApolloServerPluginLandingPageProductionDefault({
            footer: false
          })
          : ApolloServerPluginLandingPageLocalDefault({
            footer: false,
            includeCookies: true
          })],
        context: ({ req, extra }) => ({ req, extra })
      })
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.POSTGRES_HOST,
      port: parseInt(<string>process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE_NAME,
      autoLoadEntities: true,
      synchronize: true
    }),
    UserModule,
    SectionModule,
    GroupModule,
    ShiftModule,
    ClassModule,
    SubjectModule,
    RoomModule,
    PeriodModule,
    StudentModule,
    TeacherModule,
    AttendanceModule,
    IncomeModule,
    ExpenseModule,
    ComplainModule,
    NotificationModule
  ]
})
export class AppModule { }
