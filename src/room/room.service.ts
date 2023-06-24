import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { paginate, PaginationTypeEnum } from "nestjs-typeorm-paginate";

//Orm entity
import { Room } from "./model/room.entity";

//Dto
import { RoomInput } from "./dto/room.dto";
import { SearchInput } from "@/section/dto/search.dto";

//Req user
import { ReqUser } from "@/auth/Types/user.types";


@Injectable()
export class RoomService {
    //Constructor
    constructor(
        @InjectRepository(Room) private roomRepository: Repository<Room>
    ) { };

    //Get room list with pagination
    async gets(searchInput: SearchInput) {
        const rooms = await this.roomRepository
            .createQueryBuilder("room")
            .leftJoinAndSelect("room.createdBy", "createdBy")
            .orderBy("room.created_at", searchInput.orderBy ?? "DESC")

        if (searchInput.search) {
            rooms.where("LOWER(room.room_no) LIKE :search", { search: `%${searchInput.search.toLowerCase()}%` })
        }
        const { items, meta } = await paginate<Room>(rooms, {
            page: searchInput.page,
            limit: searchInput.limit,
            paginationType: PaginationTypeEnum.TAKE_AND_SKIP
        });
        return {
            results: items,
            meta
        }
    };

    //Get room list without pagination
    async getAll() {
        const rooms = await this.roomRepository.find({
            relations: {
                createdBy: true
            },
            order: {
                created_at: "DESC"
            }
        });
        return rooms;
    };

    //Create room
    async create(roomInput: RoomInput, reqUser: ReqUser) {
        const room = await this.roomRepository.findOneBy({
            room_no: roomInput.room_no
        });
        if (room) throw new NotFoundException("Room already exist!");
        const newRoom = await this.roomRepository.create({
            ...roomInput,
            createdBy: { id: reqUser.id }
        });
        await this.roomRepository.save(newRoom);
        return {
            success: true,
            message: "Room added to list successfully!"
        }
    };

    //Update Room
    async update(roomInput: RoomInput, id: string, reqUser: ReqUser) {
        const room = await this.roomRepository.findOneBy({
            id: id
        })
        if (!room) throw new NotFoundException("Room not found!");
        if (room.room_no !== roomInput.room_no) {
            const exist = await this.roomRepository.findOneBy({
                room_no: roomInput.room_no
            });
            if (exist) throw new NotFoundException("Room no. already exist");
        }
        await this.roomRepository.update(id, {
            ...roomInput,
            createdBy: { id: reqUser.id }
        });
        return {
            success: true,
            message: "Room updated successfully!"
        }
    }

    //Delete Room
    async delete(id: string) {
        try {
            const result = await this.roomRepository.delete(id);
            if (result.affected === 0) throw new NotFoundException("Room not found!");
        } catch {
            throw new NotFoundException("Cannot delete class room because it has related record!");
        }
        return {
            success: true,
            message: "Room Deleted Successfully!"
        }
    };
}