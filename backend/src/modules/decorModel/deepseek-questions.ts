// import { sequelize } from "../base-dao";
import {
  Column,
  Model,
  Table,
  DataType,
  AllowNull,
} from "sequelize-typescript";
@Table
class DeepseekQuestions extends Model {
  @Column({
    type: DataType.STRING,
  })
  question: string | undefined;
  @Column({
    type: DataType.STRING,
  })
  role: number | undefined;
  @Column({
    type: DataType.STRING(5000),
    allowNull: false,
  })
  content!: string;
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;
}
export default DeepseekQuestions;
