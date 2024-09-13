import { PrismaService } from "@components/prisma/prisma.service";
import { Injectable, Scope } from "@nestjs/common";
import { Prisma } from "@prisma/client";

@Injectable({ scope: Scope.REQUEST })
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async getOneUser(userWhereUniqueInput: Prisma.UserWhereUniqueInput) {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async createUser(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({
      data,
    });
  }

  async updateUser(params: { where: Prisma.UserWhereUniqueInput; data: Prisma.UserUpdateInput }) {
    const { where, data } = params;
    return this.prisma.user.update({
      data,
      where,
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput) {
    return this.prisma.user.delete({
      where,
    });
  }
}
