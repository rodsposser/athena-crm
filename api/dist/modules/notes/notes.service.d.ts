import { PrismaService } from '../../prisma/prisma.service';
import { CreateNoteDto, UpdateNoteDto } from './dto/create-note.dto';
export declare class NotesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
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
    create(leadId: string, userId: string, dto: CreateNoteDto): Promise<{
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
    softDelete(id: string): Promise<{
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
