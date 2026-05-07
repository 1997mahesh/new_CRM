import prisma from '../prisma/index.js';

export class BaseRepository<T> {
  protected model: any;

  constructor(modelName: string) {
    this.model = (prisma as any)[modelName];
  }

  async findAll() {
    return this.model.findMany();
  }

  async findById(id: string) {
    return this.model.findUnique({ where: { id } });
  }

  async create(data: any) {
    return this.model.create({ data });
  }

  async update(id: string, data: any) {
    return this.model.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.model.delete({ where: { id } });
  }
}
