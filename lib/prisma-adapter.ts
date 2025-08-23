import { type Adapter } from "next-auth/adapters";
import { type PrismaClient } from "@prisma/client";

export function PrismaAdapter(prisma: PrismaClient): Adapter {
    return {
        async createUser(data) {
            return prisma.user.create({ data });
        },

        async getUser(id) {
            return prisma.user.findUnique({ where: { id } });
        },

        async getUserByEmail(email) {
            return prisma.user.findUnique({ where: { email } });
        },

        async getUserByAccount({ provider, providerAccountId }) {
            const account = await prisma.account.findUnique({
                where: {
                    provider_providerAccountId: {
                        provider,
                        providerAccountId,
                    },
                },
                include: {
                    User: true,
                },
            });

            return account?.User ?? null;
        },

        async updateUser(data) {
            return prisma.user.update({
                where: { id: data.id },
                data,
            });
        },

        async deleteUser(id) {
            return prisma.user.delete({ where: { id } });
        },

        async linkAccount(account) {
            await prisma.account.create({ data: account });
        },

        async unlinkAccount({ provider, providerAccountId }) {
            await prisma.account.delete({
                where: {
                    provider_providerAccountId: {
                        provider,
                        providerAccountId,
                    },
                },
            });
        },
        async createVerificationToken() {
            throw new Error("Not implemented.");
        },
        async useVerificationToken() {
            throw new Error("Not implemented.");
        },
    };
}