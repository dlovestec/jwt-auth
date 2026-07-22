import Session from "#src/models/session.model.js";
import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from "sequelize";
import {
  AllowNull,
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  HasMany,
  IsEmail,
  Model,
  NotEmpty,
  PrimaryKey,
  Table,
  Unique,
  UpdatedAt,
} from "sequelize-typescript";

@Table({
  tableName: "users",
  modelName: "User",
  timestamps: true,
  underscored: true,
  paranoid: true,
})
export default class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  declare id: CreationOptional<number>;

  @NotEmpty
  @AllowNull(false)
  @Column(DataType.STRING)
  declare firstName: string;

  @NotEmpty
  @AllowNull(false)
  @Column(DataType.STRING)
  declare lastName: string;

  @NotEmpty
  @IsEmail
  @Unique
  @AllowNull(false)
  @Column(DataType.STRING)
  declare email: string;

  @NotEmpty
  @AllowNull(false)
  @Column(DataType.STRING)
  declare password: string;

  @CreatedAt
  declare createdAt: CreationOptional<Date>;

  @UpdatedAt
  declare updatedAt: CreationOptional<Date>;

  @DeletedAt
  declare deletedAt: CreationOptional<Date>;

  @HasMany(() => Session, {
    foreignKey: "userId",
    as: "sessions",
  })
  declare sessions?: NonAttribute<Session[]>;

  override toJSON() {
    const { password, ...rest } = this.get();
    return rest;
  }
}
