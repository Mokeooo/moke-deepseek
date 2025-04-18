import koa from "koa";
import env from "dotenv";
import routerLoader from "./common/router-loader";
import globalException from "./common/global-exception";
import { baseDao } from "./modules/base-dao";

const app = new koa();
env.config();
const init = async () => {
  baseDao.sequelize.sync();
  console.log(baseDao.getAllTables());
  
};
init();
app.use(globalException);
routerLoader.init(app);
