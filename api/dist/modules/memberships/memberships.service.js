"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembershipsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const crypto = __importStar(require("crypto"));
const bcrypt = __importStar(require("bcryptjs"));
let MembershipsService = class MembershipsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listMembers(orgId) {
        const memberships = await this.prisma.membership.findMany({
            where: { organizationId: orgId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatarUrl: true,
                        isActive: true,
                    },
                },
            },
            orderBy: { createdAt: 'asc' },
        });
        return memberships.map((m) => ({
            id: m.id,
            userId: m.userId,
            role: m.role,
            name: m.user.name,
            email: m.user.email,
            avatarUrl: m.user.avatarUrl,
        }));
    }
    async inviteMember(orgId, invitedBy, email, role) {
        const existingUser = await this.prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            const existingMembership = await this.prisma.membership.findUnique({
                where: { userId_organizationId: { userId: existingUser.id, organizationId: orgId } },
            });
            if (existingMembership) {
                throw new common_1.ConflictException('User is already a member of this organization');
            }
        }
        const existingInvitation = await this.prisma.invitation.findFirst({
            where: { organizationId: orgId, email, status: 'PENDING' },
        });
        if (existingInvitation) {
            throw new common_1.ConflictException('A pending invitation already exists for this email');
        }
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        return this.prisma.invitation.create({
            data: {
                organizationId: orgId,
                invitedBy,
                email,
                role,
                token,
                expiresAt,
            },
        });
    }
    async acceptInvite(token, name, password) {
        const invitation = await this.prisma.invitation.findUnique({ where: { token } });
        if (!invitation) {
            throw new common_1.NotFoundException('Invitation not found');
        }
        if (invitation.status !== 'PENDING') {
            throw new common_1.BadRequestException('Invitation is no longer valid');
        }
        if (invitation.expiresAt < new Date()) {
            await this.prisma.invitation.update({
                where: { id: invitation.id },
                data: { status: 'EXPIRED' },
            });
            throw new common_1.BadRequestException('Invitation has expired');
        }
        let user = await this.prisma.user.findUnique({ where: { email: invitation.email } });
        if (!user) {
            const passwordHash = await bcrypt.hash(password, 10);
            user = await this.prisma.user.create({
                data: {
                    name,
                    email: invitation.email,
                    passwordHash,
                },
            });
        }
        const [membership] = await this.prisma.$transaction([
            this.prisma.membership.create({
                data: {
                    userId: user.id,
                    organizationId: invitation.organizationId,
                    role: invitation.role,
                },
            }),
            this.prisma.invitation.update({
                where: { id: invitation.id },
                data: { status: 'ACCEPTED', acceptedAt: new Date() },
            }),
        ]);
        return membership;
    }
    async updateRole(orgId, membershipId, role) {
        const membership = await this.prisma.membership.findFirst({
            where: { id: membershipId, organizationId: orgId },
        });
        if (!membership) {
            throw new common_1.NotFoundException('Membership not found');
        }
        return this.prisma.membership.update({
            where: { id: membershipId },
            data: { role },
        });
    }
    async removeMember(orgId, membershipId) {
        const membership = await this.prisma.membership.findFirst({
            where: { id: membershipId, organizationId: orgId },
        });
        if (!membership) {
            throw new common_1.NotFoundException('Membership not found');
        }
        if (membership.role === 'OWNER') {
            const ownerCount = await this.prisma.membership.count({
                where: { organizationId: orgId, role: 'OWNER' },
            });
            if (ownerCount <= 1) {
                throw new common_1.BadRequestException('Cannot remove the last owner of the organization');
            }
        }
        return this.prisma.membership.delete({ where: { id: membershipId } });
    }
    async listInvitations(orgId) {
        return this.prisma.invitation.findMany({
            where: { organizationId: orgId },
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.MembershipsService = MembershipsService;
exports.MembershipsService = MembershipsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MembershipsService);
//# sourceMappingURL=memberships.service.js.map