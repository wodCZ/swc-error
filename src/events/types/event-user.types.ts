export interface EventReqUser {
    id: string;
    phone: string;
    name: string;
    studentId: string;
    role: string;
    is_verify: boolean;
    classId: string;
    created_at: Date;
    updated_at: Date;
}