import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import {
  AllowNull,
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
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

  override toJSON() {
    const { password, ...rest } = this.get();
    return rest;
  }
}
