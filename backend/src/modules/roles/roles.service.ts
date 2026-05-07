import prisma from '../../prisma/index.js';

export class RoleService {
  async getAll() {
    return await prisma.role.findMany({
      include: {
        _count: {
          select: { users: true, permissions: true }
        }
      }
    });
  }

  async getById(id: string) {
    return await prisma.role.findUnique({
      where: { id },
      include: {
        permissions: {
          include: {
            permission: true
          }
        }
      }
    });
  }

  async create(data: any) {
    return await prisma.role.create({
      data: {
        name: data.name,
        description: data.description,
      }
    });
  }

  async update(id: string, data: any) {
    return await prisma.role.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
      }
    });
  }

  async delete(id: string) {
    return await prisma.role.delete({
      where: { id }
    });
  }

  async updatePermissions(roleId: string, permissionIds: string[]) {
    // Delete existing
    await prisma.rolePermission.deleteMany({
      where: { roleId }
    });

    // Create new
    const newPermissions = permissionIds.map(permissionId => ({
      roleId,
      permissionId
    }));

    return await prisma.rolePermission.createMany({
      data: newPermissions
    });
  }
}
