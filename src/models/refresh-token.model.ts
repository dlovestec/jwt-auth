import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from "sequelize";
import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  ForeignKey,
  Model,
  NotEmpty,
  PrimaryKey,
  Table,
  Unique,
  UpdatedAt,
} from "sequelize-typescript";
import User from "./user.model.js";

@Table({
  tableName: "refresh_tokens",
  modelName: "RefreshToken",
  underscored: true,
  timestamps: true,
  paranoid: true,
})
export default class RefreshToken extends Model<
  InferAttributes<RefreshToken>,
  InferCreationAttributes<RefreshToken>
> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  declare id: CreationOptional<number>;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.BIGINT)
  declare userId: number;

  @Unique
  @NotEmpty
  @AllowNull(false)
  @Column(DataType.STRING(500))
  declare token: string;

  @AllowNull(false)
  @Column(DataType.DATE)
  declare expiresAt: Date;

  @CreatedAt
  declare createdAt: CreationOptional<Date>;

  @UpdatedAt
  declare updatedAt: CreationOptional<Date>;

  @DeletedAt
  declare deletedAt: CreationOptional<Date>;

  @BelongsTo(() => User, {
    foreignKey: "userId",
    as: "user",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  declare user?: NonAttribute<User>;
}
