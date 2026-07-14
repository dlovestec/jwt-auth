import {
  Attributes,
  CreateOptions,
  CreationAttributes,
  DestroyOptions,
  FindOptions,
} from "sequelize";
import { Model, ModelCtor } from "sequelize-typescript";

export interface IBaseRepository<M extends Model> {
  create(
    payload: CreationAttributes<M>,
    options?: CreateOptions<Attributes<M>>,
  ): Promise<M>;

  findOne(options?: FindOptions<M>): Promise<M | null>;
  findById(id: number, options?: FindOptions<M>): Promise<M | null>;

  delete(options: DestroyOptions<Attributes<M>>): Promise<number>;
}

export default class BaseRepository<
  M extends Model,
> implements IBaseRepository<M> {
  constructor(protected model: ModelCtor<M>) {}

  async create(
    payload: CreationAttributes<M>,
    options?: CreateOptions<Attributes<M>>,
  ): Promise<M> {
    return this.model.create(payload, options);
  }

  async findOne(options?: FindOptions<M>): Promise<M | null> {
    return this.model.findOne(options);
  }

  async findById(id: number, options?: FindOptions<M>): Promise<M | null> {
    return this.model.findByPk(id, options);
  }

  async delete(options: DestroyOptions<Attributes<M>>): Promise<number> {
    return this.model.destroy(options);
  }
}
