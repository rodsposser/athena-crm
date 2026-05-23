import { MembershipsService } from './memberships.service';
import { InviteMemberDto } from './dto/invite-member.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import type { JwtUser } from '../../common/decorators/current-user.decorator';
export declare class MembershipsController {
    private readonly service;
    constructor(service: MembershipsService);
    listMembers(orgId: string): Promise<{
        id: string;
        role: import("@prisma/client").$Enums.MembershipRole;
        name: string;
        email: string;
        avatarUrl: string | null;
    }[]>;
    invite(orgId: string, user: JwtUser, dto: InviteMemberDto): Promise<{
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
    acceptInvite(body: {
        token: string;
        name: string;
        password: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        organizationId: string;
        role: import("@prisma/client").$Enums.MembershipRole;
    }>;
    updateRole(orgId: string, id: string, dto: UpdateRoleDto): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        organizationId: string;
        role: import("@prisma/client").$Enums.MembershipRole;
    }>;
    removeMember(orgId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        organizationId: string;
        role: import("@prisma/client").$Enums.MembershipRole;
    }>;
}
