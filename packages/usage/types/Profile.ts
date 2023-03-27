import { Prisma, PrismaClient } from '@prisma/client'

export class ProfileCrud {
  constructor(private prisma: PrismaClient) {}

  create(data: Prisma.ProfileCreateInput) {
    return this.prisma.profile.create({ data })
  }

  find(args: Prisma.ProfileFindManyArgs) {
    return this.prisma.profile.findMany(args)
  }

  findOne(where: Prisma.ProfileWhereUniqueInput) {
    return this.prisma.profile.findUnique({ where })
  }

  update(
    where: Prisma.ProfileWhereUniqueInput,
    data: Prisma.ProfileUpdateInput,
  ) {
    return this.prisma.profile.update({
      where,
      data,
    })
  }

  delete(where: Prisma.ProfileWhereUniqueInput) {
    return this.prisma.profile.delete({ where })
  }
}
