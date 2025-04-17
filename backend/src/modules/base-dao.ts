import dbConfig from "../config/db";
import { type Dialect } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import path from "path";

const DATABASE = "mysql";

class BaseDao {
  static baseDao: BaseDao = new BaseDao();
  sequelize!: Sequelize;
  constructor() {
    this.initSeqConf(DATABASE);
  }

  initSeqConf(dialect: Dialect) {
    const { host, user, password, database, port } = dbConfig.getConf();
    this.sequelize = new Sequelize(database, user, password, {
      host,
      port,
      dialect, // 表示是何种数据库
      define: {
        timestamps: false, // true 表示给模型加上时间戳属性 (createAt,updateAt),false 标识不带时间戳属性
        freezeTableName: true, // true 标识使用给定的表名, false 标识模型后名加s作为表名
      },
    });
  }

  addModels() {
    const modelPath = path.join(process.cwd(), "/src/modules/decorModel");
    this.sequelize.addModels([modelPath]);
  }
}

const baseDao = BaseDao.baseDao;
baseDao.addModels();
export const { sequelize } = baseDao;
