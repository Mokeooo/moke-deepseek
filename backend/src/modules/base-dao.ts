import dbConfig from "../config/db";
import { type Dialect } from "sequelize";
import { Sequelize, Model } from "sequelize-typescript";
import fs from "fs";

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
      models: [__dirname + "/decorModel/*.ts"],
    });
  }
  getTableModel(name: string) {
    const modelNames = Reflect.ownKeys(this.sequelize.models);
    // console.log(modelNames);
    
    if (modelNames.includes(name)) return this.getAllTables()[name];
    console.warn(`cannot find the table model using ${name}`);
  }
  getAllTables() {
    return this.sequelize.models;
  }
}

const baseDao = BaseDao.baseDao;

export { baseDao };
