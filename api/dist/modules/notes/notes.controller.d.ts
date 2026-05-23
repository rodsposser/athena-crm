import { NotesService } from './notes.service';
import { CreateNoteDto, UpdateNoteDto } from './dto/create-note.dto';
export declare class NotesController {
    private readonly service;
    constructor(service: NotesService);
    findByLead(leadId: string): Promise<({
        user: {
            name: string;
            id: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        userId: string;
        leadId: string;
        content: string;
        isPinned: boolean;
        mentions: import("@prisma/client/runtime/client").JsonValue | null;
    })[]>;
    create(userId: string, leadId: string, dto: CreateNoteDto): Promise<{
        user: {
            name: string;
            id: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        userId: string;
        leadId: string;
        content: string;
        isPinned: boolean;
        mentions: import("@prisma/client/runtime/client").JsonValue | null;
    }>;
    update(id: string, dto: UpdateNoteDto): Promise<{
        user: {
            name: string;
            id: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        userId: string;
        leadId: string;
        content: string;
        isPinned: boolean;
        mentions: import("@prisma/client/runtime/client").JsonValue | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        userId: string;
        leadId: string;
        content: string;
        isPinned: boolean;
        mentions: import("@prisma/client/runtime/client").JsonValue | null;
    }>;
}
