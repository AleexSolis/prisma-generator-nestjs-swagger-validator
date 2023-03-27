import { Prisma, PrismaClient } from '@prisma/client'

export class UserCrud {
  constructor(private prisma: PrismaClient) {}

  create(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({ data })
  }

  find(args: Prisma.UserFindManyArgs) {
    return this.prisma.user.findMany(args)
  }

  findOne(where: Prisma.UserWhereUniqueInput) {
    return this.prisma.user.findUnique({ where })
  }

  update(where: Prisma.UserWhereUniqueInput, data: Prisma.UserUpdateInput) {
    return this.prisma.user.update({
      where,
      data,
    })
  }

  delete(where: Prisma.UserWhereUniqueInput) {
    return this.prisma.user.delete({ where })
  }
}
