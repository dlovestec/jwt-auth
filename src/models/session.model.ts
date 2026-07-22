import User from "#src/models/user.model.js";
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

@Table({
  tableName: "sessions",
  modelName: "Session",
  underscored: true,
  timestamps: true,
  paranoid: true,
})
export default class Session extends Model<
  InferAttributes<Session>,
  InferCreationAttributes<Session>
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
  declare tokenHash: string;

  @AllowNull(true)
  @Column(DataType.STRING(100))
  declare browser: string | null;

  @AllowNull(true)
  @Column(DataType.STRING(100))
  declare browserVersion: string | null;

  @AllowNull(true)
  @Column(DataType.STRING(100))
  declare os: string | null;

  @AllowNull(true)
  @Column(DataType.STRING(100))
  declare osVersion: string | null;

  @AllowNull(true)
  @Column(DataType.STRING(50))
  declare deviceType: string | null;

  @AllowNull(true)
  @Column(DataType.STRING(500))
  declare userAgent: string | null;

  @AllowNull(true)
  @Column(DataType.STRING(50))
  declare ipAddress: string | null;

  @AllowNull(false)
  @Column(DataType.DATE)
  declare expiresAt: Date;

  @AllowNull(false)
  @Column(DataType.DATE)
  declare lastUsedAt: Date;

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
