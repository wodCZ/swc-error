import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Raw } from "typeorm";
import * as bcrypt from "bcrypt";
import { paginate, PaginationTypeEnum } from "nestjs-typeorm-paginate";

//Orm entity
import { Student } from "./model/student.entity";
import { Subject } from "@/subject/model/subject.entity";
import { User } from "@/user/model/user.entity";

//Dto
import { StudentInput } from "./dto/student.dto";
import { StudentPaginationInput } from "./dto/student.pagination";
import { StudentPramsInput } from "./dto/student.prams";
import { PromoteInput } from "./dto/promote.dto";

//Req user
import { ReqUser } from "@/auth/Types/user.types";

@Injectable()
export class StudentService {
    //Constructor
    constructor(
        @InjectRepository(Student) private studentRepository: Repository<Student>,
        @InjectRepository(Subject) private subjectRepository: Repository<Subject>,
        @InjectRepository(User) private userRepository: Repository<User>
    ) { };

    //Gets with pagination
    async gets(studentPaginationInput: StudentPaginationInput) {
        const students = await this.studentRepository
            .createQueryBuilder("student")
            .leftJoinAndSelect("student.class", "class")
            .leftJoinAndSelect("student.section", "section")
            .leftJoinAndSelect("student.shift", "shift")
            .leftJoinAndSelect("student.group", "group")
            .orderBy("student.created_at", studentPaginationInput.orderBy ?? "DESC")
            .where("student.leave = :leave", { leave: false })
            .where("student.complete = :complete", { complete: false })

        if (studentPaginationInput.name) {
            students.where("LOWER(student.name) LIKE :search", { search: `%${studentPaginationInput.name.toLowerCase()}%` })
        }
        if (studentPaginationInput.class) {
            students.where("student.class = :classId", { classId: studentPaginationInput.class })
        }
        if (studentPaginationInput.id) {
            students.where("student.studentId = :studentId", { studentId: studentPaginationInput.id })
        }
        if (studentPaginationInput.shift) {
            students.where("student.shift = :shift", { shift: studentPaginationInput.shift })
        }
        if (studentPaginationInput.section) {
            students.where("student.section = :section", { section: studentPaginationInput.section })
        }
        if (studentPaginationInput.group) {
            students.where("student.group = :group", { section: studentPaginationInput.group })
        }

        const { items, meta } = await paginate<Student>(students, {
            page: studentPaginationInput.page,
            limit: studentPaginationInput.limit,
            paginationType: PaginationTypeEnum.TAKE_AND_SKIP
        });
        return {
            results: items,
            meta
        }
    };

    //Gets without pagination
    async getAll(studentPrams: StudentPramsInput) {
        let args = {}
        if (studentPrams.name) {
            args["name"] = Raw(alias => `LOWER(${alias}) Like '%${studentPrams.name.toLowerCase()}%'`)
        }
        if (studentPrams.id) {
            args["studentId"] = studentPrams.id
        }
        if (studentPrams.class) {
            args["class"] = {
                id: studentPrams.class
            }
        }
        args["leave"] = false;
        args["complete"] = false;

        const students = await this.studentRepository.find({
            where: args,
            relations: {
                class: true,
                section: true,
                shift: true,
                group: true
            },
            order: {
                created_at: "DESC"
            }
        });
        return students;
    }

    //Get single student
    async get(id: string) {
        const student = await this.studentRepository.findOne({
            where: {
                id: id
            },
            relations: {
                class: true,
                section: true,
                shift: true,
                group: true,
                subject: true,
                createdBy: true
            },
            order: {
                created_at: "DESC"
            }
        });
        return student;
    };

    //Get Student Profile
    async profile(reqUser: ReqUser) {
        const student = await this.studentRepository.findOne({
            where: {
                accountId: { id: reqUser.id }
            },
            relations: {
                class: true,
                subject: true,
                createdBy: true,
            }
        });
        if (!student) throw new NotFoundException("No student found!");
        return student;
    }

    //Add student
    async create(studentInput: StudentInput, reqUser: ReqUser) {
        const student = await this.studentRepository.findOneBy({
            studentId: studentInput.studentId
        });
        if (student) throw new NotFoundException("Student already added!");
        const password = await bcrypt.hash(studentInput.studentId, 12);
        const newAccountId = this.userRepository.create({
            name: studentInput.name,
            studentId: studentInput.studentId,
            image: studentInput.image,
            password: password,
            is_verify: true
        });
        await this.userRepository.save(newAccountId);
        const parent = await this.userRepository.findOneBy({
            phone: studentInput.fatherPhone
        });
        const { group, ...rest } = studentInput;
        if (!parent) {
            const newParent = this.userRepository.create({
                name: studentInput.fatherName,
                phone: studentInput.fatherPhone,
                is_verify: true,
                role: "parents"
            });
            await this.userRepository.save(newParent);
            const newStudent = this.studentRepository.create({
                ...rest,
                class: { id: studentInput.class },
                createdBy: { id: reqUser.id },
                shift: { id: studentInput.shift },
                section: { id: studentInput.section },
                ...(studentInput.group !== "" ? { group: { id: studentInput.group } } : {}),
                accountId: { id: newAccountId.id },
                parentId: { id: newParent.id }
            });
            await this.studentRepository.save(newStudent);
        } else {
            const newStudent = this.studentRepository.create({
                ...rest,
                class: { id: studentInput.class },
                createdBy: { id: reqUser.id },
                shift: { id: studentInput.shift },
                section: { id: studentInput.section },
                ...(studentInput.group !== "" ? { group: { id: studentInput.group } } : {}),
                accountId: { id: newAccountId.id },
                parentId: { id: parent.id }
            });
            await this.studentRepository.save(newStudent);
        }
        return {
            success: true,
            message: "Student added successfully!"
        }
    };

    //Update Student
    async update(studentInput: StudentInput, id: string, reqUser: ReqUser) {
        const student = await this.studentRepository.findOne({
            where: {
                id: id
            },
            relations: {
                subject: true,
                createdBy: true,
                accountId: true,
                parentId: true
            }
        });
        if (!student) throw new NotFoundException("Student not found!");
        if (student.fatherPhone !== studentInput.fatherPhone) {
            const existParentId = await this.userRepository.findOne({
                where: {
                    phone: studentInput.fatherPhone
                }
            });
            if (existParentId) throw new NotFoundException("Father phone number already exists!");
            await this.userRepository.update({
                phone: student.fatherPhone
            }, {
                phone: studentInput.fatherPhone
            });
        }
        const { group, ...rest } = studentInput;
        await this.studentRepository.update(id, {
            ...rest,
            createdBy: { id: reqUser.id },
            class: { id: studentInput.class },
            shift: { id: studentInput.shift },
            section: { id: studentInput.section },
            ...(studentInput.group !== "" ? { group: { id: studentInput.group } } : {}),
        })
        return {
            success: true,
            message: "Student updated successfully!"
        }
    };

    //Promote student
    async promote(promoteInput: PromoteInput) {
        if (promoteInput.markAs && promoteInput.markAs === "left") {
            const result = await this.studentRepository.update(promoteInput.ids, {
                leave: true
            });
            if (result.affected === 0) throw new NotFoundException("Student not found!");
        }
        else if (promoteInput.markAs && promoteInput.markAs === "completed") {
            const result = await this.studentRepository.update(promoteInput.ids, {
                complete: true
            });
            if (result.affected === 0) throw new NotFoundException("Student not found!");
        } else {
            const result = await this.studentRepository.update(promoteInput.ids, {
                class: { id: promoteInput.class },
                section: { id: promoteInput.section },
                ...(promoteInput.group !== "" ? { group: { id: promoteInput.group } } : {}),
                shift: { id: promoteInput.shift }
            });
            if (result.affected === 0) throw new NotFoundException("Student not found!");
        }
        return {
            success: true,
            message: "Student promoted successfully!"
        }
    }

    //Delete Student
    async delete(id: string) {
        const student = await this.studentRepository.findOneBy({
            id: id
        });
        if (!student) throw new NotFoundException("Student not found!");
        try {
            await this.studentRepository.delete(student.id);
        } catch {
            throw new NotFoundException("Cannot delete student because it has related record!");
        }
        await this.userRepository.delete({
            studentId: student.studentId
        });
        const parentId = await this.userRepository.findOneBy({
            phone: student.fatherPhone
        });
        const hasMoreStudent = await this.studentRepository.find({
            where: {
                accountId: { id: parentId.id }
            }
        });
        if (hasMoreStudent.length === 0) {
            await this.userRepository.delete(parentId.id);
        }
        return {
            success: true,
            message: "Student deleted successfully!"
        }
    };
}