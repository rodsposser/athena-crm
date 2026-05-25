import { PrismaService } from '../../prisma/prisma.service';
import { MembershipRole } from '@prisma/client';
export declare class MembershipsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listMembers(orgId: string): Promise<{
        id: string;
        userId: string;
        role: import("@prisma/client").$Enums.MembershipRole;
        name: string;
        email: string;
        avatarUrl: string | null;
    }[]>;
    inviteMember(orgId: string, invitedBy: string, email: string, role: MembershipRole): Promise<{
        email: string;
        id: string;
        createdAt: Date;
        organizationId: string;
        role: import("@prisma/client").$Enums.MembershipRole;
        token: string;
        status: import("@prisma/client").$Enums.InvitationStatus;
        invitedBy: string;
        expiresAt: Date;
        acceptedAt: Date | null;
    }>;
    acceptInvite(token: string, name: string, password: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        organizationId: string;
        role: import("@prisma/client").$Enums.MembershipRole;
    }>;
    updateRole(orgId: string, membershipId: string, role: MembershipRole): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        organizationId: string;
        role: import("@prisma/client").$Enums.MembershipRole;
    }>;
    removeMember(orgId: string, membershipId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        organizationId: string;
        role: import("@prisma/client").$Enums.MembershipRole;
    }>;
    listInvitations(orgId: string): Promise<{
        email: string;
        id: string;
        createdAt: Date;
        organizationId: string;
        role: import("@prisma/client").$Enums.MembershipRole;
        token: string;
        status: import("@prisma/client").$Enums.InvitationStatus;
        invitedBy: string;
        expiresAt: Date;
        acceptedAt: Date | null;
    }[]>;
}
