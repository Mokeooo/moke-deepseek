import koa from "koa";
import env from "dotenv";
import routerLoader from "./common/router-loader";
import globalException from "./common/global-exception";
import { sequelize } from "./modules/base-dao";
import { DataTypes } from "sequelize";
const app = new koa();
env.config();
const init = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    const User = sequelize.define(
      "User",
      {
        // 在这里定义模型属性
        firstName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        lastName: {
          type: DataTypes.STRING,
          // allowNull 默认为 true
          defaultValue: "Moke",
        },
      },
      {
        // 这是其他模型参数
        tableName: "user",
      }
    );
    await User.sync();
    User.create({ firstName: "Moke" });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
init();
app.use(globalException);
routerLoader.init(app);
