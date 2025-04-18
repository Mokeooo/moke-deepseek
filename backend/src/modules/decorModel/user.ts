import { DataTypes } from "sequelize";
import { Column, Model, Table, DataType } from "sequelize-typescript";
@Table
class User extends Model {
  @Column({
    type: DataType.STRING,
  })
  name: string | undefined;
  @Column({
    type: DataType.INTEGER,
  })
  age: number | undefined;
}

export default User;
