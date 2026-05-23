"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let NotificationsService = class NotificationsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(orgId, recipientId, type, title, body, metadata) {
        return this.prisma.notification.create({
            data: {
                organizationId: orgId,
                recipientId,
                type,
                title,
                body,
                metadata: (metadata ?? {}),
            },
        });
    }
    async findByUser(userId, cursor, limit = 20) {
        return this.prisma.notification.findMany({
            where: { recipientId: userId },
            orderBy: { createdAt: 'desc' },
            take: limit,
            ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
        });
    }
    async unreadCount(userId) {
        const count = await this.prisma.notification.count({
            where: { recipientId: userId, isRead: false },
        });
        return { count };
    }
    async markRead(userId, notificationId) {
        return this.prisma.notification.updateMany({
            where: { id: notificationId, recipientId: userId },
            data: { isRead: true, readAt: new Date() },
        });
    }
    async markAllRead(userId) {
        return this.prisma.notification.updateMany({
            where: { recipientId: userId, isRead: false },
            data: { isRead: true, readAt: new Date() },
        });
    }
    async getPreferences(userId) {
        return this.prisma.notificationPreference.findMany({
            where: { userId },
        });
    }
    async updatePreferences(userId, eventType, inApp, email) {
        return this.prisma.notificationPreference.upsert({
            where: {
                userId_eventType: { userId, eventType },
            },
            update: {
                ...(inApp !== undefined ? { inApp } : {}),
                ...(email !== undefined ? { email } : {}),
            },
            create: {
                userId,
                eventType,
                inApp: inApp ?? true,
                email: email ?? false,
            },
        });
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map