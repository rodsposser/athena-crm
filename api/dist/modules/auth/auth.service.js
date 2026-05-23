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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcryptjs"));
const crypto = __importStar(require("crypto"));
const prisma_service_1 = require("../../prisma/prisma.service");
let AuthService = AuthService_1 = class AuthService {
    prisma;
    jwt;
    config;
    logger = new common_1.Logger(AuthService_1.name);
    resetTokens = new Map();
    constructor(prisma, jwt, config) {
        this.prisma = prisma;
        this.jwt = jwt;
        this.config = config;
    }
    async register(dto) {
        const existing = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (existing) {
            throw new common_1.ConflictException('Email already registered');
        }
        const passwordHash = await bcrypt.hash(dto.password, 12);
        const slug = dto.organizationName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        const result = await this.prisma.$transaction(async (tx) => {
            const org = await tx.organization.create({
                data: { name: dto.organizationName, slug },
            });
            const user = await tx.user.create({
                data: {
                    name: dto.name,
                    email: dto.email,
                    passwordHash,
                },
            });
            await tx.membership.create({
                data: {
                    userId: user.id,
                    organizationId: org.id,
                    role: 'OWNER',
                },
            });
            return { user, org };
        });
        return this.generateTokens({
            sub: result.user.id,
            email: result.user.email,
            orgId: result.org.id,
            role: 'OWNER',
        });
    }
    async login(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
            include: {
                memberships: {
                    include: { organization: true },
                    take: 1,
                },
            },
        });
        if (!user || !user.isActive) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!passwordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const membership = user.memberships[0];
        if (!membership) {
            throw new common_1.UnauthorizedException('No organization found');
        }
        await this.prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
        });
        return this.generateTokens({
            sub: user.id,
            email: user.email,
            orgId: membership.organizationId,
            role: membership.role,
        });
    }
    async refresh(refreshToken) {
        try {
            const payload = this.jwt.verify(refreshToken, {
                secret: this.config.get('JWT_REFRESH_SECRET'),
            });
            const user = await this.prisma.user.findUnique({
                where: { id: payload.sub },
            });
            if (!user || !user.isActive) {
                throw new common_1.UnauthorizedException('User not found or inactive');
            }
            return this.generateTokens({
                sub: payload.sub,
                email: payload.email,
                orgId: payload.orgId,
                role: payload.role,
            });
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
    async forgotPassword(email) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            return { message: 'If the email exists, a reset link has been sent.' };
        }
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
        this.resetTokens.set(token, { email, expiresAt });
        this.logger.warn(`[DEV] Password reset token for ${email}: ${token}`);
        return {
            message: 'If the email exists, a reset link has been sent.',
            _devToken: token,
        };
    }
    async resetPassword(token, newPassword) {
        const entry = this.resetTokens.get(token);
        if (!entry) {
            throw new common_1.BadRequestException('Invalid or expired reset token');
        }
        if (entry.expiresAt < new Date()) {
            this.resetTokens.delete(token);
            throw new common_1.BadRequestException('Invalid or expired reset token');
        }
        const user = await this.prisma.user.findUnique({
            where: { email: entry.email },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const passwordHash = await bcrypt.hash(newPassword, 12);
        await this.prisma.user.update({
            where: { id: user.id },
            data: { passwordHash },
        });
        this.resetTokens.delete(token);
        return { message: 'Password has been reset successfully.' };
    }
    generateTokens(payload) {
        const accessToken = this.jwt.sign(payload, {
            secret: this.config.get('JWT_SECRET'),
            expiresIn: this.config.get('JWT_EXPIRES_IN', '15m'),
        });
        const refreshToken = this.jwt.sign(payload, {
            secret: this.config.get('JWT_REFRESH_SECRET'),
            expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN', '7d'),
        });
        return {
            accessToken,
            refreshToken,
            user: {
                id: payload.sub,
                email: payload.email,
            },
            organization: {
                id: payload.orgId,
                role: payload.role,
            },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map